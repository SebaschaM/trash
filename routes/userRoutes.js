// routes/userRoutes.js
import express from "express";
import {
  loginUser,
  registerUser,
  listarUsuarios,
  eliminarUsuario,
  verificarLoginUsuario
} from "../controllers/userController.js";

const router = express.Router();

router.post("/loginUser", loginUser);
router.post("/registerUser", registerUser);
router.get("/listarUsuarios", listarUsuarios);
router.delete("/eliminarUsuario/:usuario", eliminarUsuario);
router.post("/verificarLoginUsuario", verificarLoginUsuario);

export default router;
