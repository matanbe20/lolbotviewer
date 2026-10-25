const FALLBACK = { version: '16.21.1', championCount: 173 };
const TTL = 60 * 60 * 1000;

let cache = null;
let cachedAt = 0;

// Latest Data Dragon version and champion count, cached for an hour.
export async function getDDragonMeta() {
  if (cache && Date.now() - cachedAt < TTL) return cache;
  try {
    const versions = await (await fetch('https://ddragon.leagueoflegends.com/api/versions.json')).json();
    const version = versions[0];
    const champions = await (await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`)).json();
    cache = { version, championCount: Object.keys(champions.data).length };
    cachedAt = Date.now();
    return cache;
  } catch (e) {
    return cache ?? FALLBACK;
  }
}
