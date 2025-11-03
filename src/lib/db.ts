import mongoose from "mongoose";

const MONGODB_DB = process.env.MONGODB_DB ?? "role_auth";

interface MongooseGlobal {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseGlobal?: MongooseGlobal;
};

const cached: MongooseGlobal = globalWithMongoose.mongooseGlobal ?? {
  conn: null,
  promise: null,
};

async function dbConnect() {
  // Check if MongoDB URI is available
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set. Please configure MongoDB connection.");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB,
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;

  if (!globalWithMongoose.mongooseGlobal) {
    globalWithMongoose.mongooseGlobal = cached;
  }

  return cached.conn;
}

export async function ensureDbConnected() {
  return dbConnect();
}


