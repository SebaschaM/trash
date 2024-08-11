import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const validarDatos = async (req, res, next) => {
  const datos = req.body;
  // Verificar que dniNumero esté definido
  if (!datos.dniNumero) {
    return res.status(400).json({ error: "El campo dniNumero es requerido" });
  }

  const dni = datos.dniNumero.replace(/\./g, "");

  const filePathDatos = path.join(__dirname, "../data/datos.json");
  const filePathUsuarios = path.join(__dirname, "../data/usuarios.json");

  try {
    // Leer datos actuales
    let jsonData = [];
    try {
      const data = await fs.readFile(filePathDatos, "utf8");
      jsonData = data.trim() === "" ? [] : JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        jsonData = [];
      } else {
        throw error;
      }
    }

    // Verificar si el DNI ya existe
    const dniExistente = jsonData.find((entry) => entry.dniNumero === dni);
    if (dniExistente) {
      return res.status(400).send("El DNI ya fue creado anteriormente");
    }

    // Leer datos de usuarios
    let usuariosData = [];
    try {
      const usuarios = await fs.readFile(filePathUsuarios, "utf8");
      usuariosData = usuarios.trim() === "" ? [] : JSON.parse(usuarios);
    } catch (error) {
      if (error.code === "ENOENT") {
        usuariosData = [];
      } else {
        throw error;
      }
    }

    const usuarioIndex = usuariosData.findIndex(
      (user) => user.usuario === datos.username
    );
    if (usuarioIndex !== -1) {
      if (usuariosData[usuarioIndex].cuentaDNICreado) {
        return res.status(400).send("El DNI ya fue creado anteriormente");
      }

      req.usuarioIndex = usuarioIndex;
      req.usuariosData = usuariosData;
      next();
    } else {
      res.status(400).send("Usuario no encontrado");
    }
  } catch (error) {
    if (error.name === "SyntaxError") {
      console.error("Error al parsear el archivo JSON:", error);
      res.status(500).json({ error: "Error al parsear el archivo JSON" });
    } else {
      console.error("Error al validar los datos:", error);
      res.status(500).json({ error: "Error al validar los datos" });
    }
  }
};

export const guardarDatos = async (req, res) => {
  const datos = req.body;
  const dni = datos.dniNumero.replace(/\./g, "");
  datos.dniNumero = dni;

  if (req.files["firma"]) {
    datos.firma = req.files["firma"][0].filename;
  }
  if (req.files["foto"]) {
    datos.foto = req.files["foto"][0].filename;
  }

  const filePathDatos = path.join(__dirname, "../data/datos.json");
  const filePathUsuarios = path.join(__dirname, "../data/usuarios.json");

  try {
    // Leer datos actuales
    let jsonData = [];
    try {
      const data = await fs.readFile(filePathDatos, "utf8");
      jsonData = data.trim() === "" ? [] : JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        jsonData = [];
      } else {
        throw error;
      }
    }

    // Agregar los nuevos datos
    jsonData.push(datos);
    await fs.writeFile(filePathDatos, JSON.stringify(jsonData, null, 2));

    // Actualizar el archivo de usuarios
    const usuarioIndex = req.usuarioIndex;
    const usuariosData = req.usuariosData;

    usuariosData[usuarioIndex].cuentaDNICreado = true;
    await fs.writeFile(filePathUsuarios, JSON.stringify(usuariosData, null, 2));
    res.status(200).json({
      message: "Datos guardados correctamente y usuario actualizado",
    });
  } catch (error) {
    if (error.name === "SyntaxError") {
      console.error("Error al parsear el archivo JSON:", error);
      res.status(500).json({ error: "Error al parsear el archivo JSON" });
    } else {
      console.error("Error al guardar los datos:", error);
      res.status(500).json({ error: "Error al guardar los datos" });
    }
  }
};

export const leerDatos = async (req, res) => {
  const dni = req.params.dni.replace(/\./g, "");
  const filePath = path.join(__dirname, "../data/datos.json");

  try {
    const data = await fs.readFile(filePath, "utf8");
    const jsonData = JSON.parse(data);
    const datosEncontrados = jsonData.find(
      (entry) => entry.dniNumero.replace(/\./g, "") === dni
    );

    if (datosEncontrados) {
      res.status(200).json(datosEncontrados);
    } else {
      res.status(404).json({ error: "Datos no encontrados" });
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      res.status(404).json({ error: "Archivo de datos no encontrado" });
    } else {
      console.error("Error al leer los datos:", error);
      res.status(500).json({ error: "Error al leer los datos" });
    }
  }
};
