// filepath: /C:/Users/alber/SimpleSec/src/database.ts
import * as sqlite3 from 'sqlite3';
import { createConnection } from "typeorm";
import { open } from 'sqlite';

export async function openDb() {
  return open({
    filename: './database.db',
    driver: sqlite3.Database
  });
}

export async function connectDatabase() {
  return createConnection({
    type: "sqlite",
    database: "./database.sqlite",
    synchronize: true,
  });
}