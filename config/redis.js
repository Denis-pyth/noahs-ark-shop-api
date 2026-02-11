import dotenv from 'dotenv';
dotenv.config();

import { createClient } from 'redis';

export let redisClient;

console.log("REDIS URL:", process.env.REDIS_URL);

export const initRedis = async () => {
  redisClient = createClient({
     url: process.env.REDIS_URL
  });
  console.log("REDIS URL:", process.env.REDIS_URL);

  redisClient.on('error', (err) =>
    console.error('Redis Client Error:', err)
  );

  redisClient.on('connect', () =>
    console.log('Redis connected successfully')
  );

  await redisClient.connect();
};
