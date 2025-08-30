// lib/mongodb.ts
import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI && process.env.NODE_ENV !== 'development') {
  console.warn("⚠️ MONGODB_URI n'est pas défini dans le fichier .env");
}

// Définir une interface pour éviter `any`
interface MongooseCache {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

// Étendre `globalThis` pour inclure `mongooseCache`
/* eslint-disable no-var */
declare global {
    var mongooseCache: MongooseCache | undefined;
  }
  /* eslint-enable no-var */

// Initialiser le cache global
global.mongooseCache = global.mongooseCache || { conn: null, promise: null };

export async function connectToDatabase(): Promise<Connection> {
  if (!MONGODB_URI) {
    throw new Error("❌ MONGODB_URI n'est pas défini dans le fichier .env");
  }

  if (global.mongooseCache!.conn) return global.mongooseCache!.conn;

  if (!global.mongooseCache!.promise) {
    global.mongooseCache!.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "Lubu",
      } as mongoose.ConnectOptions)
      .then((mongoose) => mongoose.connection);
  }

  global.mongooseCache!.conn = await global.mongooseCache!.promise;
  return global.mongooseCache!.conn;
}
