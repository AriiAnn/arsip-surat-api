import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const ArsiKeluar = db.define(
  "arsip_keluar",
  {
    idKeluar: {
      primaryKey: true,
      type: DataTypes.STRING,
      autoIncrement: false,
    },
    Lampiran: DataTypes.STRING,
    namaFile: DataTypes.STRING,
    Nomor: DataTypes.STRING,
    tipeFile: DataTypes.STRING,
    tglUpload: DataTypes.DATE,
    files: DataTypes.STRING,
    url: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

export default ArsiKeluar;

(async () => {
  await db.sync();
})();
