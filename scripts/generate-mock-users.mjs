// Builds a deterministic mock "users" object from real Data Dragon data.
import { writeFileSync } from "node:fs";
// Usage: npm run mock:generate
const out = new URL("../lib/mockUsers.js", import.meta.url);
let seed = 1337;
const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const pick = (arr, n) => [...arr].sort(() => rnd() - 0.5).slice(0, n);

const ver = (await (await fetch("https://ddragon.leagueoflegends.com/api/versions.json")).json())[0];
const champs = Object.values((await (await fetch(`https://ddragon.leagueoflegends.com/cdn/${ver}/data/en_US/champion.json`)).json()).data);
const names = ["Faker Fan", "Baron Stealer", "JungleDiff", "Teemo Main", "Yuumi Enjoyer", "Inting Ivern", "Pentakill", "Smite Missed", "Ward Bot", "Flash on D", "Gank Pls", "Dragon Soul"];
const sizes = [62, 58, 58, 44, 37, 31, 26, 20, 14, 9, 5, 3];
const detailCache = {};
const users = {};
for (let u = 0; u < names.length; u++) {
  const owned = pick(champs, sizes[u]);
  const inventory = [];
  for (const c of owned) {
    detailCache[c.id] ??= (await (await fetch(`https://ddragon.leagueoflegends.com/cdn/${ver}/data/en_US/champion/${c.id}.json`)).json()).data[c.id].skins;
    const skins = detailCache[c.id].filter(s => s.num !== 0);
    const level = 1 + Math.floor(Math.pow(rnd(), 2.2) * 18);
    inventory.push({
      id: c.id,
      name: c.name,
      level,
      skins: pick(skins, Math.min(skins.length, Math.floor(rnd() * (level / 2 + 1)))).map(s => ({ num: s.num, name: s.name })),
    });
  }
  const id = String(100000000000000000n + BigInt(u * 7919));
  users[id] = {
    username: names[u],
    avatarUrl: `https://ddragon.leagueoflegends.com/cdn/${ver}/img/profileicon/${[588, 4568, 3505, 5367, 4661, 1, 6, 29, 4804, 5212, 23, 3379][u]}.png`,
    inventory,
  };
}
writeFileSync(out, "// Local preview data, used only when db_pass is not set. Generated from Data Dragon.\nmodule.exports = " + JSON.stringify(users, null, 1) + ";\n");
console.log("version", ver, "champions", champs.length, "users", Object.keys(users).length);
