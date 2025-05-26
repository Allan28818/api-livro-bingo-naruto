import express from "express";

import { LocalStorage } from "node-localstorage";
import { NinjaProps } from "./models/NinjaProps";

const app = express();

app.use(express.json());

const localstorage = new LocalStorage("./database/ninjas");

// Buscar os ninjas foragidos
app.get("/", (req, res) => {
  const ninjas = localstorage.getItem("ninjas");
  const parsedNinjas = JSON.parse(ninjas || "[]");
  res.status(200).json({ ninjas: parsedNinjas });
});

// Adicionar à lista
app.post("/add/ninja", (req, res) => {
  const ninja = req.body as NinjaProps;

  const ninjasFromDb = localstorage.getItem("ninjas")?.toString() || "";
  const parsedDb = JSON.parse(ninjasFromDb || "[]");

  const ninjasList: NinjaProps[] = Array.isArray(parsedDb) ? parsedDb : [];

  ninjasList.push(ninja);

  localstorage.setItem("ninjas", JSON.stringify(ninjasList));

  res.status(201).json({
    message: "Ninja adicionado",
  });
});

// Atualizar
app.patch("/update/ninja", (req, res) => {});

// Remover
app.delete("/delete/ninja", (req, res) => {});

app.listen(3000, () => {
  console.log("Servidor rodando 🍥");
});
