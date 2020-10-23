import contentDisposition from "content-disposition";
import execa from "execa";
import pathToFfmpeg from "ffmpeg-static";
import absoluteUrl from "next-absolute-url";
import fetch from "node-fetch";
import queryString from "query-string";

const handler = async (req, res) => {
  const {
    query: { url, f },
  } = req;
  if (url) {
    try {
      const { origin } = absoluteUrl(req);
      const data = await fetch(
        `${origin}/api/info?${queryString.stringify({ f, q: url })}`
      );
      if (data.status !== 200) {
        return res.status(400).send(await data.text());
      }
      const info = await data.json();
      if (info.entries) {
        return res.status(400).send("does not support playlists");
      }
      const audioOnly = info.acodec !== "none" && info.vcodec === "none";
      if (info.acodec === "none" && info.vcodec !== "none") {
        return res.status(400).send("only video, no audio");
      }
      const ffmpegArgs = ["-i", info.url || info.requested_formats[0].url];
      if (audioOnly) {
        res.contentType = "audio/mpeg3";
        ffmpegArgs.push("-acodec", "libmp3lame", "-f", "mp3");
      } else {
        res.contentType = "video/mp4";
        if (info.requested_formats) {
          ffmpegArgs.push("-i", info.requested_formats[1].url);
        }
        ffmpegArgs.push(
          "-c:v",
          "libx264",
          "-acodec",
          "aac",
          "-movflags",
          "frag_keyframe+empty_moov",
          "-f",
          "mp4"
        );
      }
      res.setHeader(
        "Content-Disposition",
        contentDisposition(`${info.title}.${audioOnly ? "mp3" : "mp4"}`)
      );
      ffmpegArgs.push("-");
      const ffSp = execa(pathToFfmpeg, ffmpegArgs);
      ffSp.stdout.pipe(res);
      await ffSp;
    } catch (error) {
      return res.status(400).send(error.stderr || error.msg);
    }
  } else {
    return res.status(400).send("url parameter required");
  }
};

export default handler;
