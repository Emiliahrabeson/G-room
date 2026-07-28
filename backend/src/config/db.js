import mysql, { createPool } from "mysql2/promise";
import { configDotenv } from "dotenv";

configDotenv();

const DB_NAME = process.env.DB_NAME;
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWD = process.env.DB_PASSWORD;

const db = await createPool({
  host: DB_HOST,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWD,
});

console.log("Connected!");
if (!db) {
  console.log("erreur connexion!");
}

export default db;
