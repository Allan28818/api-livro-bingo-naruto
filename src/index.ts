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

/**
 * Exercício 01: Criar o método de atualizar usuário
 *
 * Restrições:
 * - Não pode atualziar o "id", caso o id venha no body, vocês irão utilizar o operador delete no
 * req.body.id
 * - Quero editar o registro que tenha exatamente o mesmo id do req.params.id
 * - Caso o registro não exista, retornar uma mensagem com o código HTTP adequado para elemento não
 * encontrado e uma mensagem falando que o Ninja não está cadastrado
 */
app.patch("/update/ninja/:id", (req, res) => {

  // Receber o id da URL
  try {
      const id = req.params.id

      const ninjas = localstorage.getItem("ninjas");
      const parsedNinjas: NinjaProps[] = JSON.parse(ninjas || "[]");

      const meuNinja = parsedNinjas.filter(ninja => ninja.id == id)
      let ninjaAtualizado =  meuNinja[0]

      Object.assign(ninjaAtualizado, req.body)

      const ninjasFiltrados: NinjaProps[] = parsedNinjas.filter(ninja => ninja.id !== id)
      ninjasFiltrados.push(ninjaAtualizado)

      localstorage.setItem("ninjas", JSON.stringify(ninjasFiltrados))

      res.status(200).json({mensagem: "Ninja atualizado com sucesso!"})
  } catch (error){
      res.status(500).json({mensagem: "Houve um erro inesperado ao atualizar ninja!"})
  }

});


// /update/ninja/4
// Remover
app.delete("/delete/ninja", (req, res) => {});

app.listen(3000, () => {
  console.log("Servidor rodando 🍥");
});
