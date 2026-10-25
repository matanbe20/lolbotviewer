const CDN = "https://ddragon.leagueoflegends.com/cdn";

export const art = {
  loading: (id, num = 0) => `${CDN}/img/champion/loading/${id}_${num}.jpg`,
  splash: (id, num = 0) => `${CDN}/img/champion/splash/${id}_${num}.jpg`,
  icon: (version, id) => `${CDN}/${version}/img/champion/${id}.png`,
  detail: (version, id) => `${CDN}/${version}/data/en_US/champion/${id}.json`,
};

// Collection tiers by pull level, highest first.
export const TIERS = [
  { key: "mythic", label: "Mythic", min: 15 },
  { key: "legendary", label: "Legendary", min: 10 },
  { key: "epic", label: "Epic", min: 5 },
  { key: "rare", label: "Rare", min: 3 },
  { key: "common", label: "Common", min: 0 },
];

export const tierFor = (level) => TIERS.find((t) => Number(level) >= t.min);

export const levelOf = (champion) => Number(champion.level) || 1;

export const totalPulls = (user) =>
  user.inventory.reduce((sum, c) => sum + levelOf(c), 0);

export const totalSkins = (user) =>
  user.inventory.reduce((sum, c) => sum + (c.skins?.length || 0), 0);

export const byLevel = (inventory) =>
  [...inventory].sort((a, b) => levelOf(b) - levelOf(a) || a.name.localeCompare(b.name));

// Most unique champions first, total pulls as the tiebreaker.
export const rankUsers = (users) =>
  Object.keys(users).sort((a, b) => {
    const countDiff = users[b].inventory.length - users[a].inventory.length;
    return countDiff !== 0 ? countDiff : totalPulls(users[b]) - totalPulls(users[a]);
  });

export const summarize = (id, user, rank) => ({
  id,
  rank,
  username: user.username ?? "Unknown",
  avatarUrl: user.avatarUrl ?? null,
  champions: user.inventory.length,
  pulls: totalPulls(user),
  skins: totalSkins(user),
  top: byLevel(user.inventory)
    .slice(0, 3)
    .map((c) => ({ id: c.id, name: c.name, level: levelOf(c) })),
});

export const percent = (value, max) =>
  max ? Math.min(100, Math.round((value / max) * 100)) : 0;
