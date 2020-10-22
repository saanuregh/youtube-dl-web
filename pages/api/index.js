import contentDisposition from "content-disposition";
import execa from "execa";
import pathToFfmpeg from "ffmpeg-static";

import { ytdlInfo } from "../../lib/ytdl";

const handler = async (req, res) => {
  const {
    query: { url, f },
  } = req;
  if (url) {
    try {
      const info = await ytdlInfo(url, f);
      if (info.entries) {
        return res.status(400).send("does not support playlists");
      }
      const audioOnly = info.acodec !== "none" && info.vcodec === "none";
      const audioIdx =
        info.requested_formats &&
        info.requested_formats.findIndex((f) => f.format.includes("audio"));
      if (info.acodec === "none" && info.vcodec !== "none") {
        return res.status(400).send("only video, no audio");
      }
      const ffmpegArgs = [
        "-i",
        info.url || info.requested_formats[audioIdx].url,
      ];
      if (audioOnly) {
        res.contentType = "audio/mpeg3";
        ffmpegArgs.push("-acodec", "libmp3lame", "-f", "mp3");
      } else {
        res.contentType = "video/mp4";
        if (info.requested_formats) {
          ffmpegArgs.push(
            "-i",
            info.requested_formats[audioIdx === 1 ? 0 : 1].url
          );
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
      return res.status(400).send(error.stderr);
    }
  } else {
    return res.status(400).send("url parameter required");
  }
};

export default handler;
