import { MongoClient } from 'mongodb';

// src/database/mongodb.ts
var cachedClient = null;
var cachedDb = null;
async function connectToDatabase(options = {}) {
  const MONGODB_URI = options.uri || process.env.MONGODB_URI;
  const MONGODB_DB = options.dbName || process.env.MONGODB_DB || "database";
  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }
  if (cachedClient && cachedDb) {
    try {
      await cachedClient.db().admin().ping();
      return { client: cachedClient, db: cachedDb };
    } catch (error) {
      console.log("Cached MongoDB connection is dead, reconnecting...");
      cachedClient = null;
      cachedDb = null;
    }
  }
  console.log("Connecting to MongoDB...");
  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: options.serverSelectionTimeoutMS || 5e3,
    family: options.family || 4
  });
  try {
    await client.connect();
    const db = client.db(MONGODB_DB);
    cachedClient = client;
    cachedDb = db;
    console.log("Successfully connected to MongoDB");
    return { client, db };
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw new Error(
      `MongoDB connection failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
async function closeConnection() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    console.log("MongoDB connection closed");
  }
}
function createMongoDBConnection(config) {
  return () => connectToDatabase(config);
}

export { closeConnection, connectToDatabase, createMongoDBConnection };
//# sourceMappingURL=mongodb.mjs.map
//# sourceMappingURL=mongodb.mjs.map