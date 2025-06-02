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
  const ninjasList = JSON.parse(ninjasFromDb || "[]");

  ninja.id = uuid();

  ninjasList.push(ninja);

  localstorage.setItem("ninjas", JSON.stringify(ninjasList));

  res.status(201).json({
    message: "Ninja adicionado",
  });
});

app.patch("/update/ninja/:id", (req, res) => {
  const { id } = req.params;
  const body: NinjaProps = req.body;

  body.id = id;

  const ninjas = localstorage.getItem("ninjas");
  const parsedNinjas: NinjaProps[] = JSON.parse(ninjas || "[]");

  let hasEdited = false;

  parsedNinjas.forEach((ninja, index) => {
    if (ninja.id === id) {
      const updatedNinja = { ...ninja, ...body };
      const deleteCount = 1;

      parsedNinjas.splice(index, deleteCount, updatedNinja);

      hasEdited = true;
      return;
    }
  });

  if (!hasEdited) {
    res.status(404).json({ message: "Ninja não encontrado no livro bingo" });
    return;
  }

  localstorage.setItem("ninjas", JSON.stringify(parsedNinjas));

  res.status(200).json({ message: "Ninja atualizado com sucesso" });
});

// Remover
app.delete("/delete/ninja/:id", (req, res) => {

  const { id } = req.params;

  const ninjas = localstorage.getItem("ninjas");
  const parsedNinjas: NinjaProps[] = JSON.parse(ninjas || "[]");

  let alreadyRemoved: boolean = false;

  parsedNinjas.forEach((ninja, index) => {
    if (ninja.id === id) {
    
      const deleteCount = 1;

      parsedNinjas.splice(index, deleteCount);

      alreadyRemoved = true;

      return;
    }
  });

  if (!alreadyRemoved) {
    res.status(404).json({ message: "Ninja não encontrado no livro bingo" });
    return;
  }

  localstorage.setItem("ninjas", JSON.stringify(parsedNinjas));

  res.status(200).json({ message: "Ninja removido com sucesso!" });
});

app.listen(3000, () => {
  console.log("Servidor rodando 🍥");
});
