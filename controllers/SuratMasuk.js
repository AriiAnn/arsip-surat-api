import path from "path";
import SuratMasuk from "../models/SuratMasuk.js";
import fs from "fs";

export const geSuratMasuk = async (req, res) => {
  try {
    const suratMasuk = await SuratMasuk.findAll();
    res.json(suratMasuk);
  } catch (error) {
    console.log(error);
  }
};

export const getSuratMasukById = async (req, res) => {
  try {
    const response = await SuratMasuk.findOne({
      where: {
        idMasuk: req.params.idMasuk,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const createSuratMasuk = async (req, res) => {
  if (req.files === null) return res.status(400).json({ msg: "No File Uploaded" });
  try {
    const idMasuk = req.body.idMasuk;
    const Lampiran = req.body.Lampiran;
    const namaFile = req.body.namaFile;
    const Nomor = req.body.Nomor;
    const tglUpload = req.body.tglUpload;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/files/${fileName}`;
    const allowedType = [".pdf", ".docx", ".doc", ".pptx", ".xlsx"];

    const tipeFile = ext.toLowerCase();

    if (!allowedType.includes(tipeFile)) return res.status(422).json({ msg: "Invalid File" });
    if (fileSize > 5000000) return res.status(422).json({ msg: "File must be less than 5 MB" });

    file.mv(`./public/files/${fileName}`, async (err) => {
      if (err) return res.status(500).json({ msg: err.message });
      try {
        await SuratMasuk.create({
          idMasuk: idMasuk,
          Lampiran: Lampiran,
          namaFile: namaFile,
          Nomor: Nomor,
          tipeFile: tipeFile,
          tglUpload: tglUpload,
          files: fileName,
          url: url,
        });
        res.status(201).json({ msg: "Surat Masuk Created Successfuly" });
      } catch (error) {
        console.log(error.message);
      }
    });
  } catch (error) {}
};

export const updateSuratMasuk = async (req, res) => {
  const arsipMasuk = await SuratMasuk.findOne({
    where: {
      idMasuk: req.params.idMasuk,
    },
  });
  if (!arsipMasuk) return res.status(404).json({ msg: "No Data Found" });

  let fileName = "";
  let tipeFile = arsipMasuk.tipeFile; // Menyimpan tipeFile dari data sebelumnya

  if (req.files === null) {
    fileName = arsipMasuk.files;
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = [".pdf", ".docx", ".doc", ".pptx", ".xlsx"];

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid files" });
    if (fileSize > 5000000) return res.status(422).json({ msg: "File must be less than 5 MB" });

    const filepath = `./public/files/${arsipMasuk.files}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/files/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });

    // Mengubah tipeFile berdasarkan ekstensi file yang baru diupload
    tipeFile = ext.toLowerCase();
  }

  const idMasuk = req.body.idMasuk;
  const Lampiran = req.body.Lampiran;
  const namaFile = req.body.namaFile;
  const Nomor = req.body.Nomor;
  const tglUpload = req.body.tglUpload;
  const url = `${req.protocol}://${req.get("host")}/files/${fileName}`;

  try {
    await arsipMasuk.update(
      {
        idMasuk: idMasuk,
        namaFile: namaFile,
        Lampiran: Lampiran,
        Nomor: Nomor,
        tipeFile: tipeFile, // Menggunakan tipeFile yang telah diubah
        tglUpload: tglUpload,
        files: fileName,
        url: url,
      },
      {
        where: {
          idMasuk: req.params.idMasuk,
        },
      }
    );
    res.status(200).json({ msg: "Surat Masuk Updated Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteSuratMasuk = async (req, res) => {
  try {
    const suratmasuk = await SuratMasuk.findOne({
      where: {
        idMasuk: req.params.idMasuk,
      },
    });

    if (!suratmasuk) {
      return res.status(404).json({ msg: "surat Masuk Not Found" });
    }

    const filePath = `./public/files/${suratmasuk.files}`;

    fs.unlink(filePath, async (err) => {
      await suratmasuk.destroy();
      res.status(200).json({ msg: "surat eluar Deleted" });
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};
