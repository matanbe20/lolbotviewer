# LoLBot Viewer

Leaderboard and champion collections for the LoLBot bot, styled after the League of Legends client.
Built with [Next.js](https://nextjs.org/) (pages router); champion art comes from Riot's [Data Dragon](https://developer.riotgames.com/docs/lol#data-dragon) CDN.

- `/` – leaderboard, ranked by unique champions (total pulls break ties)
- `/inventory/<userId>` – a player's collection, with a skin viewer per champion
- `/api/getAll`, `/api/fetch?user=<userId>` – raw user data

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Data

User data lives in Redis under the `users` key (see `lib/users.js`):

```js
{ [userId]: { username, avatarUrl, inventory: [{ id, name, level, skins: [{ num, name }] }] } }
```

Set `db_pass` (e.g. in `.env.local`) to read from Redis.

### Mock data for development

Without `db_pass`, or with `USE_MOCK_DATA=1`, the app serves `lib/mockUsers.js` instead: 12 fake players built
from real champions and skins, so the UI can be developed without database access.

Regenerate it (e.g. after new champions are released) with:

```bash
npm run mock:generate
```

## Structure

- `pages/` – routes; data is loaded in `getServerSideProps`
- `components/` – UI (`Layout`, `Leaderboard`, `Profile`, `SkinViewer`, …), styled with CSS modules
- `lib/users.js` – Redis / mock data access
- `lib/ddragon.js` – latest Data Dragon version and champion count (cached for an hour)
- `lib/collection.js` – ranking, stats, rarity tiers and art URLs
