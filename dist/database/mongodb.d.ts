import { MongoClient, Db } from 'mongodb';
import { MongoDBConfig } from './types';

interface ConnectToDatabaseOptions {
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
declare function connectToDatabase(options?: ConnectToDatabaseOptions): Promise<{
    client: MongoClient;
    db: Db;
}>;
/**
 * Close the MongoDB connection (for cleanup)
 */
declare function closeConnection(): Promise<void>;
/**
 * Create a MongoDB connection factory with custom config
 * @param config - MongoDB configuration
 * @returns Connection function
 */
declare function createMongoDBConnection(config: MongoDBConfig): () => Promise<{
    client: MongoClient;
    db: Db;
}>;

export { type ConnectToDatabaseOptions, closeConnection, connectToDatabase, createMongoDBConnection };
