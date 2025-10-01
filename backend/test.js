const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log('Successfully connected to Atlas');
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await client.close();
  }
}

run();