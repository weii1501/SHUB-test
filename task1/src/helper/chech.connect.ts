import { DataSource } from "typeorm";
import os from "os";
import process from "process";
import { myDataSource } from "../app-data-source";

const _SECONDS = 5000;

const countConnect = () => {
  // Số lượng kết nối với SQLite trong TypeORM
  // Mặc định là một kết nối duy nhất khi sử dụng SQLite với TypeORM
  const isConnected = myDataSource.isInitialized;
  const numConnection = isConnected ? 1 : 0;
  console.log("Number of Connections", numConnection);
};

const checkOverload = () => {
  setInterval(() => {
    // Số lượng kết nối với SQLite trong TypeORM
    const isConnected = myDataSource.isInitialized;
    const numConnection = isConnected ? 1 : 0;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // Ví dụ về số kết nối tối đa dựa trên số lõi CPU
    const maxConnection = numCores * 5;

    console.log(`Active Connection: ${numConnection}`);
    console.log(`Memory Usage: ${memoryUsage / 1024 / 1024} MB`);

    if (numConnection > maxConnection) {
      console.log("Overload Connection");
      process.exit(1);
    }
  }, _SECONDS);
};

export { countConnect, checkOverload };
