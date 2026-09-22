import Redis from "ioredis";

let redis;

export const getRedis = () => {
  if (!redis) {
    const url = process.env.REDIS_URL;
    // En desarrollo sin REDIS_URL, no intentamos conectar (usamos fallback en memoria)
    if (!url && process.env.NODE_ENV !== "production") {
      return null;
    }
    redis = new Redis(url || "redis://localhost:6379", {
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
    console.log("Redis: omitido en desarrollo (sin REDIS_URL)");
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