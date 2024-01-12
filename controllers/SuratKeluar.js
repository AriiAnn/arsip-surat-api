import path from "path";
import SuratKeluar from "../models/SuratKeluar.js";
import fs from "fs";

export const geSuratKeluar = async (req, res) => {
  try {
    const suratkeluar = await SuratKeluar.findAll();
    res.json(suratkeluar);
  } catch (error) {
    console.log(error);
  }
};

export const getSuratKeluarById = async (req, res) => {
  try {
    const response = await SuratKeluar.findOne({
      where: {
        idKeluar: req.params.idKeluar,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const createSuratKeluar = async (req, res) => {
  if (req.files === null) return res.status(400).json({ msg: "No File Uploaded" });
  try {
    const idKeluar = req.body.idKeluar;
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
        await SuratKeluar.create({
          idKeluar: idKeluar,
          Lampiran: Lampiran,
          namaFile: namaFile,
          Nomor: Nomor,
          tipeFile: tipeFile,
          tglUpload: tglUpload,
          files: fileName,
          url: url,
        });
        res.status(201).json({ msg: "Surat Keluar Created Successfuly" });
      } catch (error) {
        console.log(error.message);
      }
    });
  } catch (error) {}
};

export const updateSuratKeluar = async (req, res) => {
  const arsipKeluar = await SuratKeluar.findOne({
    where: {
      idKeluar: req.params.idKeluar,
    },
  });
  if (!arsipKeluar) return res.status(404).json({ msg: "No Data Found" });

  let fileName = "";
  let tipeFile = arsipKeluar.tipeFile; // Menyimpan tipeFile dari data sebelumnya

  if (req.files === null) {
    fileName = arsipKeluar.files;
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = [".pdf", ".docx", ".doc", ".pptx", ".xlsx"];

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid files" });
    if (fileSize > 5000000) return res.status(422).json({ msg: "File must be less than 5 MB" });

    const filepath = `./public/files/${arsipKeluar.files}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/files/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });

    // Mengubah tipeFile berdasarkan ekstensi file yang baru diupload
    tipeFile = ext.toLowerCase();
  }

  const idKeluar = req.body.idKeluar;
  const Lampiran = req.body.Lampiran;
  const namaFile = req.body.namaFile;
  const Nomor = req.body.Nomor;
  const tglUpload = req.body.tglUpload;
  const url = `${req.protocol}://${req.get("host")}/files/${fileName}`;

  try {
    await arsipKeluar.update(
      {
        idKeluar: idKeluar,
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
          idKeluar: req.params.idKeluar,
        },
      }
    );
    res.status(200).json({ msg: "Surat Keluar Updated Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteSuratKeluar = async (req, res) => {
  try {
    const suratkeluar = await SuratKeluar.findOne({
      where: {
        idkeluar: req.params.idkeluar,
      },
    });

    if (!suratkeluar) {
      return res.status(404).json({ msg: "surat keluar Not Found" });
    }

    const filePath = `./public/files/${suratkeluar.files}`;

    fs.unlink(filePath, async (err) => {
      await suratkeluar.destroy();
      res.status(200).json({ msg: "surat keluar Deleted" });
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};
