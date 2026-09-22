import Redis from "ioredis";

let redis;

export const getRedis = () => {
  if (!redis) {
    const url = process.env.REDIS_URL;
    // Sin REDIS_URL no intentamos conectar (usamos fallback en memoria).
    // Antes esto solo aplicaba en desarrollo y en producción spameaba
    // reintentos contra localhost.
    if (!url) {
      return null;
    }
    redis = new Redis(url, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (process.env.NODE_ENV !== "production") return null; // No reintentar en dev
        return Math.min(times * 100, 3000);
      },
      lazyConnect: true,
      connectTimeout: 5000,
    });
    redis.on("error", (err) => console.error("Redis error:", err.message));
  }
  return redis;
};

export const connectRedis = async () => {
  const client = getRedis();
  if (!client) {
    console.log("Redis: omitido (sin REDIS_URL), usando fallback en memoria");
    return null;
  }
  if (client.status === "wait") {
    try {
      await client.connect();
    } catch (e) {
      console.warn("Redis: no conectado, usando fallback en memoria");
      return null;
    }
  }
  return client;
};

export default { getRedis, connectRedis };