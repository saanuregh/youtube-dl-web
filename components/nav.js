import Link from "next/link";

const links = [
  { href: "https://github.com/vercel/next.js", label: "github" },
  {
    href: "https://github.com/ytdl-org/youtube-dl/blob/master/docs/supportedsites.md",
    label: "supported sites",
  },
];

export default function Nav() {
  return (
    <nav>
      <ul
        className="flex items-center justify-between p-4 text-lg font-bold text-white no-underline"
        style={{ height: "6vh", overflow: "hidden" }}
      >
        <li className="text-shine text-popin">
          <Link href="/">youtube-dl-web</Link>
        </li>
        <ul className="flex items-center justify-between space-x-4">
          {links.map(({ href, label }) => (
            <li key={`${href}${label}`} className="text-shine text-popin">
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
      </ul>
    </nav>
  );
}
