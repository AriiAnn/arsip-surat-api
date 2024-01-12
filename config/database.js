import { Sequelize } from "sequelize";

const db = new Sequelize("arsip_kp", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
