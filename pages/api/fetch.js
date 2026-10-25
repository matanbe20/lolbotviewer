import { getUser } from '../../lib/users';

export default async function handler(req, res) {
  return res.status(200).send(await getUser(req.query.user));
}
