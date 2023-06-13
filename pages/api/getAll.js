const redis = require('redis');
const { promisify } = require('util');
const redisClient = redis.createClient({
  port: 11411,
  host: 'redis-11411.c267.us-east-1-4.ec2.cloud.redislabs.com',
  password: process.env.db_pass,
});
const USERS_LIST = 'users';

export default async function handler(req, res) {
  const getAsync = promisify(redisClient.get).bind(redisClient);
  const users = await getAsync(USERS_LIST);
  console.log(users)
  return res.status(200).send(JSON.parse(users));
}



