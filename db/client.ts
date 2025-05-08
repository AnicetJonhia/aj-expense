import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { expenses } from './schema';


const expoDb = SQLite.openDatabaseSync('db.db');


expoDb.execAsync(`
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    amount INTEGER NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL
  );
`).then(() => {
  console.log("Table 'expenses' prête ✅");
}).catch((err) => {
  console.error("Erreur de création de table :", err);
});

// Initialise Drizzle
export const db = drizzle(expoDb, {
  schema: { expenses }
});
