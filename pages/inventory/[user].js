import Layout from "../../components/Layout";
import Profile from "../../components/Profile";
import { getUsers } from "../../lib/users";
import { getDDragonMeta } from "../../lib/ddragon";
import { byLevel, rankUsers } from "../../lib/collection";

export default function ProfilePage({ user, rank, totalPlayers, meta }) {
  return (
    <Layout title={user.username ?? "Unknown"} backdrop={byLevel(user.inventory)[0]?.id} active="profile">
      <Profile user={user} rank={rank} totalPlayers={totalPlayers} meta={meta} />
    </Layout>
  );
}

export const getServerSideProps = async ({ params }) => {
  const [users, meta] = await Promise.all([getUsers(), getDDragonMeta()]);
  const user = users[params.user];
  if (!user) return { notFound: true };
  const ranking = rankUsers(users);
  return {
    props: {
      user,
      rank: ranking.indexOf(params.user) + 1,
      totalPlayers: ranking.length,
      meta,
    },
  };
};
