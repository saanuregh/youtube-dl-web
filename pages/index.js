import absoluteUrl from "next-absolute-url";
import { useRouter } from "next/router";
import { useState } from "react";

const INIT_FORM = {
  format: "bestvideo+bestaudio/best",
  query: "",
};

export default function IndexPage({ origin }) {
  const router = useRouter();
  const [iFocused, setIFocused] = useState(false);
  const [bFocused, setBFocused] = useState(false);
  const [formData, setFormData] = useState(INIT_FORM);
  return (
    <div className="flex flex-col self-center w-full my-auto text-white">
      <div
        className={`flex flex-col p-4 transition-all duration-300 ease-in-out transform scale-100 ${
          iFocused ? "opacity-0" : "opacity-100"
        }`}
      >
        <h1 className="mb-2 text-2xl font-semibold pointer-events-none text-shine">
          a minimal web ui and serverless api for youtube-dl
        </h1>
        <span className="text-sm font-bold xl:text-base">
          to download -{" "}
          <span className="px-1 font-mono bg-bunker-600">{`${origin}/api`}</span>
        </span>
        <div className="mb-1 font-mono text-xs">
          <span className="font-bold">parameters</span>
          <ul>
            <li>url - url to the media, no playlists (required)</li>
            <li>
              f - format as per{" "}
              <a
                className="font-bold"
                href="https://github.com/ytdl-org/youtube-dl/blob/master/README.md#format-selection"
              >
                youtube-dl format
              </a>{" "}
              (default: bestvideo+bestaudio/best)
            </li>
          </ul>
        </div>
        <span className="text-sm font-bold xl:text-base">
          to get info -{" "}
          <span className="px-1 font-mono bg-bunker-600">{`${origin}/api/info`}</span>
        </span>
        <div className="font-mono text-xs">
          <span className="font-bold">parameters</span>
          <ul>
            <li>q - search query or url (required)</li>
            <li>
              f - format as per{" "}
              <a
                className="font-bold"
                href="https://github.com/ytdl-org/youtube-dl/blob/master/README.md#format-selection"
              >
                youtube-dl format
              </a>{" "}
              (default: bestvideo+bestaudio/best)
            </li>
          </ul>
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push({
            pathname: "/result",
            query: { f: formData.format, q: formData.query },
          });
        }}
        method="GET"
        action="/result"
        className={`w-full px-4 transition duration-150 ease-in-out transform ${
          iFocused ? "-translate-y-full" : ""
        }`}
      >
        <input
          style={{
            caretColor: "white",
          }}
          onFocus={() => setIFocused(true)}
          onBlur={(e) => {
            if (!bFocused) {
              setFormData(INIT_FORM);
              setIFocused(false);
            }
          }}
          onChange={(e) => setFormData({ ...formData, query: e.target.value })}
          type="text"
          name="q"
          className={` w-full text-xl xl:text-5xl placeholder-current bg-transparent appearance-none ${
            iFocused ? "text-shine" : "text-shine-mono"
          }`}
          placeholder="click here to enter url or search query"
          autoComplete="off"
          value={formData.query}
        />
        <div
          className={`flex flex-col items-start w-full appearance-none transition ease-in-out delay-150 duration-300 font-bold ${
            iFocused && formData.query
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
          onMouseEnter={() => setBFocused(true)}
          onMouseLeave={() => setBFocused(false)}
        >
          <label>
            <span className="text-xs leading-none">format: </span>
            <input
              onChange={(e) =>
                setFormData({ ...formData, format: e.target.value })
              }
              style={{
                caretColor: "white",
              }}
              type="text"
              name="f"
              className="w-64 text-sm bg-transparent outline-none opacity-50 appearance-none"
              autoComplete="off"
              value={formData.format}
            />
          </label>
          <button className="font-bold" type="submit">
            submit
          </button>
        </div>
      </form>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const { origin } = absoluteUrl(req);
  return {
    props: { origin },
  };
}
