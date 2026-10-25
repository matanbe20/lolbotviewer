// Old links used /inventory?user=<id>; send them to /inventory/<id>.
export default function LegacyInventory() {
  return null;
}

export const getServerSideProps = async ({ query }) => ({
  redirect: {
    destination: query.user ? `/inventory/${encodeURIComponent(query.user)}` : "/",
    permanent: true,
  },
});
