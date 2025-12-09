import { MongoClient } from 'mongodb';

// src/database/mongodb.ts
var cachedClient = null;
var cachedDb = null;
async function connectToDatabase(options = {}) {
  const MONGODB_URI = options.uri || process.env.MONGODB_URI;
  const MONGODB_DB = options.dbName || process.env.MONGODB_DB || "database";
  console.log("[MongoDB] Connection requested with dbName:", options.dbName || "not specified");
  console.log("[MongoDB] MONGODB_DB env:", process.env.MONGODB_DB || "not set");
  console.log("[MongoDB] Using database:", MONGODB_DB);
  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }
  if (cachedClient && cachedDb) {
    console.log("[MongoDB] Using cached connection to database:", cachedDb.databaseName);
    try {
      await cachedClient.db().admin().ping();
      return { client: cachedClient, db: cachedDb };
    } catch (error) {
      console.log("Cached MongoDB connection is dead, reconnecting...");
      cachedClient = null;
      cachedDb = null;
    }
  }
  console.log("[MongoDB] Connecting to MongoDB...");
  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: options.serverSelectionTimeoutMS || 5e3,
    family: options.family || 4
  });
  try {
    await client.connect();
    const db = client.db(MONGODB_DB);
    cachedClient = client;
    cachedDb = db;
    console.log("[MongoDB] Successfully connected to database:", db.databaseName);
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