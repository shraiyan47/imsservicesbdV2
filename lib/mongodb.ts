import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
let cachedClient: MongoClient | null = null;

export async function connectToDatabase() {
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(uri);
  cachedClient = await client.connect();
  return cachedClient;
}

export async function getDatabase() {
  const client = await connectToDatabase();
  return client.db('newims25db');
}
