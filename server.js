import express from "express";
import cors from "cors";

import dataRoutes from "./routes/dataRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api", dataRoutes);
app.use("/api", userRoutes);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});