from typing import Optional
from fastapi import FastAPI, Response, status, HTTPException
from fastapi.responses import StreamingResponse, PlainTextResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from rfc6266_parser import build_header
import youtube_dl
from youtube_dl.version import __version__ as youtube_dl_version
import ffmpeg
from sys import platform

FFMPEG_PATH = "api/bin/ffmpeg"
if platform == "win32":
    FFMPEG_PATH = FFMPEG_PATH + ".exe"

DEFAULT_FORMAT = "bestvideo+bestaudio/best"
DEFAULT_SEARCH = "ytsearch10"

app = FastAPI()


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    return PlainTextResponse(str(exc.detail), status_code=exc.status_code)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return PlainTextResponse(str(exc), status_code=status.HTTP_400_BAD_REQUEST)


@app.get("/", status_code=status.HTTP_200_OK)
async def download(url: str, f: str = DEFAULT_FORMAT):
    ydl_opts = {
        "format": f,
        "retries": 3,
        "encoding": "utf8",
    }
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        try:
            res = ydl.extract_info(url, download=False)
            if res.get("entries"):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="does not support playlists",
                )
            audio_only = res["acodec"] != "none" and res["vcodec"] == "none"
            input = (
                ffmpeg.concat(
                    ffmpeg.input(res["requested_formats"][0]["url"]),
                    ffmpeg.input(res["requested_formats"][1]["url"]),
                    v=1,
                    a=1,
                )
                if "requested_formats" in res
                else ffmpeg.input(res["url"])
            )
            if res["vcodec"] != "none" and res["acodec"] == "none":
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="only video, no audio",
                )
            output = (
                input.output(
                    "-",
                    acodec="libmp3lame",
                    format="mp3",
                )
                if audio_only
                else input.output(
                    "-",
                    vcodec="libx264",
                    acodec="aac",
                    movflags="frag_keyframe+empty_moov",
                    format="mp4",
                )
            )

            async def streaming_fn():
                process = output.run_async(pipe_stdout=True, cmd=FFMPEG_PATH)
                while process.poll() is None:
                    packet = process.stdout.read(1024)
                    yield packet
                process.wait()

            return StreamingResponse(
                streaming_fn(),
                media_type="video/mp4",
                headers={
                    "Content-Disposition": str(
                        build_header(
                            f'{res["title"]}.{"mp3" if audio_only else "mp4" }'
                        )
                    )
                },
            )
        except Exception as e:
            print(e)
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=repr(e))


@app.get("/info", status_code=status.HTTP_200_OK)
async def get_info(q: str, response: Response, f: str = DEFAULT_FORMAT):
    ydl_opts = {
        "default_search": DEFAULT_SEARCH,
        "format": f,
        "retries": 3,
        "encoding": "utf8",
    }
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        try:
            res = ydl.extract_info(q, download=False)
            return res
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=repr(e))


@app.get("/version", status_code=status.HTTP_200_OK)
async def get_version():
    return PlainTextResponse(youtube_dl_version)
