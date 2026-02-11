export async function validateSession(req, res, next) {
   if (!req.auth) {
    return next();
  }

  const deviceId = req.headers['x-device-id'];
  const { userId, jti } = req.auth;

  if (!deviceId) {
    return res.status(401).json({ message: 'Device ID missing' });
  }

  const storedJti = await redisClient.get(
    `session:${userId}:${deviceId}`
  );

  if (!storedJti || storedJti !== jti) {
    return res.status(401).json({ message: 'Session invalid or expired' });
  }

  next();
}
