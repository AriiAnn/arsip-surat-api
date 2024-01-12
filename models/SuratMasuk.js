import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const ArsiMasuk = db.define(
  "arsip_masuk",
  {
    idMasuk: {
      primaryKey: true,
      type: DataTypes.STRING,
      autoIncrement: false,
    },
    Lampiran: DataTypes.STRING,
    namaFile: DataTypes.STRING,
    Nomor: DataTypes.STRING,
    Tanggal: DataTypes.DATE,
    tipeFile: DataTypes.STRING,
    tglUpload: DataTypes.STRING,
    files: DataTypes.STRING,
    url: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

export default ArsiMasuk;

(async () => {
  await db.sync();
})();
