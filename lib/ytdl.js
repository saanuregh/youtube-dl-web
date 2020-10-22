import execa from "execa";
import youtubedl from "youtube-dl";

const DEFAULT_ARGS = [
  "--retries",
  "3",
  "--ignore-errors",
  "--ignore-config",
  "--encoding",
  "utf8",
  "-J",
];

export const DEFAULT_FORMAT = "bestvideo+bestaudio/best";
export const DEFAULT_SEARCH = "ytsearch10";

export async function ytdlInfo(q, f = DEFAULT_FORMAT, s = false) {
  try {
    if (q === undefined || q === "") {
      throw new Error("url/query parameter required");
    }
    const args = [...DEFAULT_ARGS];
    s && args.push("--default-search", DEFAULT_SEARCH);
    args.push("-f", f, q);
    const { stdout } = await execa(youtubedl.getYtdlBinary(), args);
    return JSON.parse(stdout);
  } catch (error) {
    throw error;
  }
}
