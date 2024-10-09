import dotenv from 'dotenv';
import app from "./src/app";

dotenv.config();

const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

const server = app.listen(PORT, () => {
  console.log(`WSV Todo List start with port ${PORT}`);
});

process.on("uncaughtException", async (error) => {
  console.log("Error", error);
  process.exit(1);
});
