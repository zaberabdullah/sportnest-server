// config/db.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let client;
let db;

export async function connectDB() {
  if (db) return db;
  
  client = new MongoClient(uri);
  await client.connect();
  db = client.db();
  console.log("MongoDB Connected!");
  return db;
}

export function getDB() {
  if (!db) throw new Error("DB not connected! Call connectDB first.");
  return db;
}