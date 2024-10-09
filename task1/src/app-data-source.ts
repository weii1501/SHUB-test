import { DataSource } from "typeorm";
import { DATABASE_NAME, LOGGING } from "./config/db.config";



export const myDataSource = new DataSource({
  type: "sqlite",
  database: DATABASE_NAME,
  entities: ["src/entity/*.ts"],
  // logging: LOGGING,
  synchronize: true,
});
