import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Invalid/Missing environment variable: 'MONGODB_URL'");
}

if (!process.env.MONGODB_DB) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_DB"');
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

// The MongoClient is a class that allows you to make connections to MongoDB.
// You can use a single instance of MongoClient to connect to a cluster and
// use it across all of your application’s database operations.
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  // Extend the NodeJS.Global interface to include our cached promise
  // This is a TypeScript-specific feature to avoid type errors.

  const globalWithMongo = global as typeof global & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
  }

  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  // The module is executed only once per serverless function invocation,
  // so the clientPromise will be reused.
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getMongoClient() {
  return clientPromise;
}

export async function getDb() {
  const mongoClient = await getMongoClient();
  return mongoClient.db(dbName);
}
