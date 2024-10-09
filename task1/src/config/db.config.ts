import dotenv from "dotenv";
dotenv.config(); 

export const DATABASE_NAME = process.env.NODE_ENV === "dev" ? "database.sqlite" : "database.test.sqlite";
export const LOGGING = process.env.NODE_ENV === "dev" ? true : false;
export const DB_TYPE = process.env.DB_TYPE || "sqlite";
