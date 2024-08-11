import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loginUser = async (req, res) => {
  const { usuario, contrasena } = req.body;
  const filePath = path.join(__dirname, "../data/usuarios.json");
  const dataPath = path.join(__dirname, "../data/datos.json");

  try {
    // Leer y parsear usuarios.json
    const usuariosData = await fs.readFile(filePath, "utf8");
    if (!usuariosData) throw new Error("usuarios.json está vacío");
    const usuarios = JSON.parse(usuariosData);

    // Leer y parsear datos.json
    const datosData = await fs.readFile(dataPath, "utf8");
    if (!datosData) throw new Error("datos.json está vacío");
    const datos = JSON.parse(datosData);

    const usuarioEncontrado = usuarios.find(
      (entry) => entry.usuario === usuario
    );
    if (!usuarioEncontrado) {
      return res
        .status(401)
        .json({ status: 401, message: "Usuario no encontrado" });
    }

    const contrasenaValida = await bcrypt.compare(
      contrasena,
      usuarioEncontrado.contrasena
    );

    if (contrasenaValida) {
      if (usuarioEncontrado.duracion === -1) {
        // Redirigir al administrador
        return res.status(200).json({
          status: 200,
          message: "Administrador autenticado",
          urlRedirect: "/Admin/admin.html",
          nombreUsuario: usuarioEncontrado.usuario,
        });
      } else {
        const usuarioData = datos.find((entry) => entry.username === usuario);

        if (usuarioData) {
          return res.status(200).json({
            status: 200,
            message: "Usuario autenticado",
            urlRedirect: "/Inicio/incio.html",
            dni: usuarioData.dniNumero,
            nombreUsuario: usuarioEncontrado.usuario,
          });
        } else {
          return res.status(200).json({
            status: 200,
            message: "Usuario autenticado",
            urlRedirect: "/Formulario/formulario.html",
            nombreUsuario: usuarioEncontrado.usuario,
          });
        }
      }
    } else {
      return res
        .status(401)
        .json({ status: 401, message: "Usuario no autorizado" });
    }
  } catch (error) {
    console.error("Error al leer los datos:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Error al procesar la solicitud" });
  }
};

export const registerUser = async (req, res) => {
  const { usuario, contrasena, duracion } = req.body;
  const filePath = path.join(__dirname, "../data/usuarios.json");
  try {
    let jsonData = [];
    try {
      const data = await fs.readFile(filePath, "utf8");
      jsonData = data.trim() === "" ? [] : JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        jsonData = [];
      } else {
        throw error;
      }
    }

    const usuarioExistente = jsonData.find(
      (entry) => entry.usuario === usuario
    );
    if (usuarioExistente) {
      return res
        .status(400)
        .json({ status: 400, message: "El nombre de usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const fechaCreacion = new Date().toISOString();
    jsonData.push({
      usuario,
      contrasena: hashedPassword,
      duracion,
      fechaCreacion,
      cuentaDNICreado: false,
    });

    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));
    res
      .status(200)
      .json({ status: 200, message: "Usuario registrado correctamente" });
  } catch (error) {
    if (error.name === "SyntaxError") {
      console.error("Error al parsear el archivo JSON:", error);
      res
        .status(500)
        .json({ status: 500, message: "Error al parsear el archivo JSON" });
    } else {
      console.error("Error al guardar los datos:", error);
      res
        .status(500)
        .json({ status: 500, message: "Error al guardar los datos" });
    }
  }
};

export const listarUsuarios = async (req, res) => {
  const filePath = path.join(__dirname, "../data/usuarios.json");

  try {
    const data = await fs.readFile(filePath, "utf8");
    const jsonData = JSON.parse(data);

    // Filtrar los usuarios con duración diferente a -1
    const usuariosFiltrados = jsonData.filter(
      (usuario) => usuario.duracion !== -1
    );

    // Añadir el índice a los usuarios filtrados
    const usuariosConIndice = usuariosFiltrados.map((usuario, index) => ({
      id: index + 1,
      ...usuario,
    }));

    res.status(200).json(usuariosConIndice);
  } catch (error) {
    if (error.code === "ENOENT") {
      res
        .status(404)
        .json({ status: 404, message: "Archivo de usuarios no encontrado" });
    } else {
      console.error("Error al leer los datos:", error);
      res.status(500).json({ status: 500, message: "Error al leer los datos" });
    }
  }
};

export const eliminarUsuario = async (req, res) => {
  const usuario = req.params.usuario;
  const filePath = path.join(__dirname, "../data/usuarios.json");

  try {
    const data = await fs.readFile(filePath, "utf8");
    let jsonData = JSON.parse(data);
    const usuarioIndex = jsonData.findIndex(
      (entry) => entry.usuario === usuario
    );

    if (usuarioIndex === -1) {
      return res
        .status(404)
        .json({ status: 404, message: "Usuario no encontrado" });
    }

    jsonData.splice(usuarioIndex, 1);
    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));
    res
      .status(200)
      .json({ status: 200, message: "Usuario eliminado correctamente" });
  } catch (error) {
    if (error.code === "ENOENT") {
      res
        .status(404)
        .json({ status: 404, message: "Archivo de usuarios no encontrado" });
    } else {
      console.error("Error al leer los datos:", error);
      res.status(500).json({ status: 500, message: "Error al leer los datos" });
    }
  }
};

export const verificarLoginUsuario = async (req, res) => {
  const { usuario } = req.body;
  const filePath = path.join(__dirname, "../data/usuarios.json");

  try {
    const data = await fs.readFile(filePath, "utf8");
    const jsonData = JSON.parse(data);

    const usuarioEncontrado = jsonData.find(
      (entry) => entry.usuario === usuario
    );

    if (!usuarioEncontrado) {
      return res
        .status(404)
        .json({ status: 404, message: "Usuario no encontrado" });
    }

    return res.status(200).json({ status: 200, message: "Usuario encontrado" });
  } catch (error) {
    if (error.code === "ENOENT") {
      res
        .status(404)
        .json({ status: 404, message: "Archivo de usuarios no encontrado" });
    } else {
      console.error("Error al leer los datos:", error);
      res.status(500).json({ status: 500, message: "Error al leer los datos" });
    }
  }
};
