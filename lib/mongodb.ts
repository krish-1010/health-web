import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

/** * Use the explicit 'Mongoose' type from the library
 * to avoid circular 'typeof' references.
 */
declare global {
  var mongoose:
    | {
        conn: mongoose.Mongoose | null;
        promise: Promise<mongoose.Mongoose> | null;
      }
    | undefined;
}

async function dbConnect() {
  // 1. Ensure the global cache exists
  if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
  }

  // 2. Create a local reference so TS knows it's not undefined
  const cached = global.mongoose;

  // 3. Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // 4. Create a new promise if one isn't already in progress
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log("✅ Connected to MongoDB!");
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
