import { MongoClient, Db } from 'mongodb';
import type { MongoDBConfig } from './types';

// MongoDB connection caching
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export interface ConnectToDatabaseOptions {
  uri?: string;
  dbName?: string;
  serverSelectionTimeoutMS?: number;
  family?: 4 | 6;
}

/**
 * Connect to MongoDB with connection pooling and health checks
 * @param options - Connection options
 * @returns MongoDB client and database
 */
export async function connectToDatabase(
  options: ConnectToDatabaseOptions = {}
) {
  const MONGODB_URI = options.uri || process.env.MONGODB_URI;
  const MONGODB_DB = options.dbName || process.env.MONGODB_DB || 'database';

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  // Check if we have a cached connection
  if (cachedClient && cachedDb) {
    // Verify the connection is still alive
    try {
      await cachedClient.db().admin().ping();
      return { client: cachedClient, db: cachedDb };
    } catch (error) {
      console.log('Cached MongoDB connection is dead, reconnecting...');
      // Connection is dead, reset cache
      cachedClient = null;
      cachedDb = null;
    }
  }

  // Create new connection
  console.log('Connecting to MongoDB...');
  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: options.serverSelectionTimeoutMS || 5000,
    family: options.family || 4,
  });

  try {
    await client.connect();
    const db = client.db(MONGODB_DB);

    // Cache the successful connection
    cachedClient = client;
    cachedDb = db;

    console.log('Successfully connected to MongoDB');
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error(
      `MongoDB connection failed: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Close the MongoDB connection (for cleanup)
 */
export async function closeConnection() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    console.log('MongoDB connection closed');
  }
}

/**
 * Create a MongoDB connection factory with custom config
 * @param config - MongoDB configuration
 * @returns Connection function
 */
export function createMongoDBConnection(config: MongoDBConfig) {
  return () => connectToDatabase(config);
}
