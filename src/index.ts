import express from "express";

import { LocalStorage } from "node-localstorage";
import { NinjaProps } from "./models/NinjaProps";

import { v4 as uuid } from "uuid";

const app = express();

app.use(express.json());

const localstorage = new LocalStorage("./database/ninjas");

// Buscar os ninjas foragidos
app.get("/", (req, res) => {
  const { name } = req.query;
  const ninjas = localstorage.getItem("ninjas");
  const parsedNinjas: NinjaProps[] = JSON.parse(ninjas || "[]");

  if (name) {
    const filteredNinjas = parsedNinjas.filter((ninja) => {
      ninja.name === name;
    });

    res.status(200).json({ ninjas: filteredNinjas });

    return;
  }

  res.status(200).json({ ninjas: parsedNinjas });
});

// Adicionar à lista
app.post("/add/ninja", (req, res) => {
  const ninja = req.body as NinjaProps;

  const ninjasFromDb = localstorage.getItem("ninjas")?.toString() || "";
  const parsedDb = JSON.parse(ninjasFromDb || "[]");

  ninja.id = uuid();

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
