import express from "express";
import { geSuratMasuk, getSuratMasukById, createSuratMasuk, updateSuratMasuk, deleteSuratMasuk } from "../controllers/SuratMasuk.js";

const router = express.Router();

router.get("/arsip_masuk", geSuratMasuk);
router.get("/arsip_masuk/:idMasuk", getSuratMasukById);
router.post("/arsip_masuk", createSuratMasuk);
router.patch("/arsip_masuk/:idMasuk", updateSuratMasuk);
router.delete("/arsip_masuk/:idMasuk", deleteSuratMasuk);

export default router;
