import Layout from "../components/Layout";
import Leaderboard from "../components/Leaderboard";
import { getUsers } from "../lib/users";
import { getDDragonMeta } from "../lib/ddragon";
import { rankUsers, summarize } from "../lib/collection";

export default function LeaderboardPage({ players, totals, meta }) {
  return (
    <Layout title="Leaderboard" backdrop={players[0]?.top[0]?.id} active="leaderboard">
      <Leaderboard players={players} totals={totals} meta={meta} />
    </Layout>
  );
}

export const getServerSideProps = async () => {
  const [users, meta] = await Promise.all([getUsers(), getDDragonMeta()]);
  const players = rankUsers(users).map((id, i) => summarize(id, users[id], i + 1));
  const discovered = new Set(
    Object.values(users).flatMap((user) => user.inventory.map((c) => c.id))
  );
  const totals = {
    summoners: players.length,
    discovered: discovered.size,
    pulls: players.reduce((sum, p) => sum + p.pulls, 0),
    skins: players.reduce((sum, p) => sum + p.skins, 0),
  };
  return { props: { players, totals, meta } };
};
