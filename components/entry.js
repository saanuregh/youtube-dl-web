import prettyMilliseconds from "pretty-ms";
import { useState } from "react";

const format_keys = [
  "format",
  "format_id",
  "format_note",
  "height",
  "width",
  "fps",
  "ext",
  "filesize",
  "vcodec",
  "acodec",
  "tbr",
  "abr",
  "protocol",
  "url",
];

export default function Entry({ data, origin }) {
  const [format, setFormat] = useState(null);
  const best = data.format_id;
  const downloads = data.formats.reduce((a, c) => {
    let x = {
      id: c.format_id,
      label: c.format,
    };
    if (data.extractor_key.toLowerCase() === "youtube") {
      const j =
        c.format.includes("audio") && c.format_id !== best.split("+")[1];
      const k =
        !c.format.includes("audio") &&
        c.ext === "webm" &&
        data.formats.filter((i) => i.format_note === c.format_note).length >= 2;
      const l = c.vcodec !== "none" && c.acodec !== "none";
      if (j || k || l) {
        return a;
      }
      if (c.vcodec !== "none" && c.acodec === "none") {
        x = {
          id: `${c.format_id}+${best.split("+")[1]}`,
          label: c.format,
        };
      }
    }
    return [...a, x];
  }, []);
  return (
    <div className="flex flex-col p-4 m-2 overflow-hidden transition duration-150 ease-in-out border border-transparent rounded-lg bg-bunker-900 hover:border-white">
      <div className="flex space-x-2">
        <a href={data.webpage_url}>
          <img
            src={data.thumbnail}
            className="h-20 rounded-lg"
            alt={data.title}
          />
        </a>
        <div className="flex flex-col text-sm font-semibold">
          <a href={data.webpage_url} className="text-base font-bold">
            {data.title}
          </a>
          <a href={data.uploader_url}>{`uploaded by ${data.uploader}`}</a>
          <span>{`extracted from ${data.extractor_key.toLowerCase()}`}</span>
          {data.is_live && <span className="text-xs">livestream</span>}
          {data.duration && (
            <span className="text-xs">
              {`duration of ${prettyMilliseconds(data.duration * 1000)}`}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col my-2">
        <span className="my-1 font-bold">formats available:</span>
        <div className="flex flex-wrap ">
          {data.formats.map((f) => (
            <button
              type="button"
              key={f.format_id}
              onClick={() => (format === f ? setFormat(null) : setFormat(f))}
              className={`p-1 mb-1 mr-1 text-xs transition duration-150 ease-in-out border border-transparent rounded-lg appearance-none hover:border-white ${
                format === f ? "border-white" : ""
              }`}
            >
              <span>{f.format}</span>
            </button>
          ))}
        </div>
        {format && (
          <>
            <span className="my-1 font-bold">selected format:</span>
            <div className="flex flex-wrap">
              {format_keys.map(
                (i) =>
                  format[i] && (
                    <div className="inline-flex flex-col mb-1 mr-2 ">
                      <span className="text-xs">{i.replace("_", " ")}</span>
                      <span>{format[i]}</span>
                    </div>
                  )
              )}
            </div>
          </>
        )}
        <span className="my-1 font-bold">downloads available:</span>
        {data.is_live ? (
          <span className="text-xs">livestreams cannot be downloaded</span>
        ) : (
          <div className="flex flex-wrap ">
            {downloads.map((f) => (
              <a
                key={f.id}
                href={`${origin}/api?url=${data.webpage_url}&f=${f.id.replace(
                  "+",
                  "%2B"
                )}`}
              >
                <button
                  type="button"
                  className={`p-1 mb-1 mr-1 text-xs transition duration-150 ease-in-out border border-transparent rounded-lg appearance-none hover:border-white ${
                    format === f ? "border-white" : ""
                  }`}
                >
                  <span>{f.id === best ? `${f.label} (best)` : f.label}</span>
                </button>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
