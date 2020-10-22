import { ytdlInfo } from "../../lib/ytdl";

const handler = async (req, res) => {
  const {
    query: { q, f },
  } = req;
  if (q) {
    try {
      const info = await ytdlInfo(q, f, true);
      res.setHeader("Cache-Control", "max-age=0, s-maxage=86400");
      return res.status(200).json(info);
    } catch (error) {
      return res.status(400).send(error.stderr);
    }
  } else {
    return res.status(400).send("Query parameter required");
  }
};

export default handler;
