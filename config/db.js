const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;


if (!uri) {
  console.error("CRITICAL ERROR: MONGODB_URI is not defined in .env file!");
  process.exit(1);
}

const client = new MongoClient(uri);
let db = null;

const connectDB = async () => {
  if (db) return db;
  await client.connect();
  db = client.db("sportnest");
  console.log("MongoDB Native Driver Connected Successfully!");
  return db;
};

const getDB = () => db;

module.exports = { connectDB, getDB };