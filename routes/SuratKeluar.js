import express from "express";
import { geSuratKeluar, getSuratKeluarById, createSuratKeluar, updateSuratKeluar, deleteSuratKeluar } from "../controllers/SuratKeluar.js";

const router = express.Router();

router.get("/arsip_keluar", geSuratKeluar);
router.get("/arsip_keluar/:idKeluar", getSuratKeluarById);
router.post("/arsip_keluar", createSuratKeluar);
router.patch("/arsip_keluar/:idKeluar", updateSuratKeluar);
router.delete("/arsip_keluar/:idKeluar", deleteSuratKeluar);

export default router;
