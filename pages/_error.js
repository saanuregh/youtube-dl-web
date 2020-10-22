export default function Error({ statusCode, title }) {
  return (
    <div className="flex flex-col items-center self-center w-full my-auto text-white">
      <span className="text-6xl font-black">{statusCode}</span>
      <span className="px-10 text-center">{title}</span>
    </div>
  );
}

export async function getServerSideProps({ res, err }) {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return {
    props: { statusCode },
  };
}
