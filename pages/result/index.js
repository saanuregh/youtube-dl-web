import absoluteUrl from "next-absolute-url";
import Scrollbar from "react-scrollbars-custom";

import Entry from "../../components/entry";
import Error from "../_error";

export default function Result({ data, error, statusCode, origin }) {
  return statusCode === 200 ? (
    <div className="text-white">
      <div style={{ height: "94vh", overflow: "hidden" }}>
        {data.entries ? (
          <Scrollbar style={{ height: "94vh" }}>
            <div className="flex flex-col p-4 m-2 text-xs font-semibold transition duration-150 ease-in-out border border-transparent rounded-lg bg-bunker-900 hover:border-white">
              <span className="mb-1 text-base font-bold">playlist details</span>
              {data.title && (
                <a className="text-sm font-bold" href={data.webpage_url}>
                  {data.title}
                </a>
              )}
              {data.uploader && (
                <a href={data.uploader_url}>{`uploaded by ${data.uploader}`}</a>
              )}
              <span>{`extracted from ${data.extractor_key.toLowerCase()}`}</span>
            </div>
            {data.entries.map((e) => (
              <Entry key={e.id} data={e} />
            ))}
          </Scrollbar>
        ) : (
          <Entry data={data} origin={origin} />
        )}
      </div>
    </div>
  ) : (
    <Error statusCode={statusCode} title={error} />
  );
}

export async function getServerSideProps({ req, query: { q, f } }) {
  const { origin } = absoluteUrl(req);
  const props = { data: null, error: null, origin, statusCode: 200 };
  const res = await fetch(`${origin}/api?q=${q}&f=${f.id.replace("+", "%2B")}`);
  if (res.status === 200) {
    props.data = await res.json();
  } else {
    props.statusCode = 400;
    props.error = await res.text();
  }
  return { props };
}
