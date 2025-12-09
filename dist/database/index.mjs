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

// src/database/newsletter.ts
var NewsletterService = class {
  constructor(config = {}) {
    this.collectionName = config.collectionName || "newsletter_subscribers";
    this.dbName = config.dbName;
  }
  /**
   * Subscribe a new email to the newsletter
   */
  async subscribe(email, metadata) {
    if (!email) {
      throw new Error("Email is required");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
    const { db } = await connectToDatabase({ dbName: this.dbName });
    const collection = db.collection(this.collectionName);
    const existingSubscriber = await collection.findOne({ email });
    if (existingSubscriber) {
      if (!existingSubscriber.active) {
        await collection.updateOne(
          { email },
          {
            $set: {
              active: true,
              resubscribedAt: /* @__PURE__ */ new Date()
            }
          }
        );
        return {
          id: existingSubscriber._id?.toString() || "",
          message: "Successfully resubscribed to newsletter"
        };
      }
      throw new Error("Email already subscribed");
    }
    const result = await collection.insertOne({
      email,
      subscribedAt: /* @__PURE__ */ new Date(),
      active: true,
      source: "website",
      metadata
    });
    return {
      id: result.insertedId.toString(),
      message: "Successfully subscribed to newsletter"
    };
  }
  /**
   * Unsubscribe an email from the newsletter (soft delete)
   */
  async unsubscribe(email) {
    if (!email) {
      throw new Error("Email is required");
    }
    const { db } = await connectToDatabase({ dbName: this.dbName });
    const collection = db.collection(this.collectionName);
    const result = await collection.updateOne(
      { email },
      {
        $set: {
          active: false,
          unsubscribedAt: /* @__PURE__ */ new Date()
        }
      }
    );
    if (result.matchedCount === 0) {
      throw new Error("Email not found");
    }
    return { message: "Successfully unsubscribed from newsletter" };
  }
  /**
   * Get all active subscribers
   */
  async getActiveSubscribers() {
    const { db } = await connectToDatabase({ dbName: this.dbName });
    const collection = db.collection(this.collectionName);
    return collection.find({ active: true }).toArray();
  }
  /**
   * Get subscriber count
   */
  async getSubscriberCount() {
    const { db } = await connectToDatabase({ dbName: this.dbName });
    const collection = db.collection(this.collectionName);
    return collection.countDocuments({ active: true });
  }
};
function createNewsletterService(config) {
  return new NewsletterService(config);
}

export { NewsletterService, closeConnection, connectToDatabase, createMongoDBConnection, createNewsletterService };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map