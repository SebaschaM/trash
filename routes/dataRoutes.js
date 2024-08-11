import express from "express";
import multer from "multer";
import path from "path";
import {
  guardarDatos,
  leerDatos,
  validarDatos,
} from "../controllers/dataController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.fieldname === "foto" ? "data/fotos" : "data/firmas";
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    // Generar un número aleatorio o un identificador único
    const randomId = Math.floor(Math.random() * 1000000).toString();
    const extension = path.extname(file.originalname);
    cb(null, `${randomId}${extension}`);
  },
});

const upload = multer({ storage });

router.post(
  "/guardarDatos",
  upload.fields([
    { name: "firma", maxCount: 1 },
    { name: "foto", maxCount: 1 },
  ]),
  validarDatos,
  guardarDatos
);
router.get("/leerDatos/:dni", leerDatos);

export default router;