const redis = require('redis');
const { promisify } = require('util');

const USERS_LIST = 'users';

// Without db_pass (or with USE_MOCK_DATA=1) we serve generated mock data instead of Redis.
let redisClient = null;
const getClient = () => {
  if (!redisClient) {
    redisClient = redis.createClient({
      port: 11411,
      host: 'redis-11411.c267.us-east-1-4.ec2.cloud.redislabs.com',
      password: process.env.db_pass,
    });
  }
  return redisClient;
};

export async function getUsers() {
  if (!process.env.db_pass || process.env.USE_MOCK_DATA === '1') {
    return require('./mockUsers');
  }
  const client = getClient();
  const getAsync = promisify(client.get).bind(client);
  return JSON.parse(await getAsync(USERS_LIST));
}

export async function getUser(id) {
  const users = await getUsers();
  return users[id] ?? null;
}
