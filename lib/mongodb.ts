import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const fallbackUri = process.env.MONGODB_URI_FALLBACK || '';
let cachedClient: MongoClient | null = null;

async function createConnectedClient(connectionString: string) {
  const client = new MongoClient(connectionString, {
    serverSelectionTimeoutMS: 10000,
    appName: 'imsservices',
  });
  await client.connect();
  return client;
}

export async function connectToDatabase() {
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  if (cachedClient) {
    return cachedClient;
  }

  try {
    cachedClient = await createConnectedClient(uri);
    return cachedClient;
  } catch (error) {
    const isSrvFailure =
      error instanceof Error &&
      error.message.includes('querySrv') &&
      uri.startsWith('mongodb+srv://');

    if (isSrvFailure && fallbackUri) {
      console.warn(
        'MongoDB SRV resolution failed, retrying with fallback direct-host URI.'
      );
      cachedClient = await createConnectedClient(fallbackUri);
      return cachedClient;
    }

    throw error;
  }
}

export async function getDatabase() {
  const client = await connectToDatabase();
  return client.db('newims25db');
}
