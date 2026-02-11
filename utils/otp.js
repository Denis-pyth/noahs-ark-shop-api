import {redisClient} from '../config/redis.js';
import crypto from 'crypto';

export const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

export async function enforceOTPCooldown({
  userId,
  deviceId,
  type,
  cooldownSeconds = 60
}){
const cooldownKey = `otp_cooldown:${type}:${userId}:${deviceId}`;
  const exists = await redisClient.get(cooldownKey);

if (exists) {
  throw new Error('Please wait before requesting another OTP');
}

await redisClient.setEx(cooldownKey, cooldownSeconds, '1'); 
};

export const storeOTP = async ({
  userId,
  deviceId,
  otp,
  type,
  expiryMinutes = 10,
}) => {

  await enforceOTPCooldown({ userId, deviceId, type });

  const key = `otp:${type}:${userId}:${deviceId}`;
  await redisClient.setEx(key, expiryMinutes * 60, otp);
};

export const verifyOTP = async ({
  userId,
  deviceId,
  otp,
  type = 'login',
}) => {
  const key = `otp:${type}:${userId}:${deviceId}`;
  const storedOTP = await redisClient.get(key);

  if (!storedOTP) {
    return { valid: false, message: 'OTP expired or not found' };
  }

  if (storedOTP !== otp) {
    return { valid: false, message: 'Invalid OTP' };
  }

  await redisClient.del(`otp_cooldown:${type}:${userId}:${deviceId}`);
  await redisClient.del(key);
  return { valid: true, message: 'OTP verified successfully' };
};

