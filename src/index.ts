import express from "express";

import { LocalStorage } from "node-localstorage";
import { NinjaProps } from "./models/NinjaProps";

const app = express();

app.use(express.json());

const localstorage = new LocalStorage("./database/ninjas");

// Buscar os ninjas foragidos
app.get("/", async (req, res) => {
  const ninjas = await localstorage.getItem("ninjas");
  const parsedNinjas: NinjaProps[] = await JSON.parse(ninjas || "[]");

// ==============================================================
// ==============================================================

  /** MODO SIMPLES  - filtro unico */

  // const { name } = req.query;

  // const resultado = parsedNinjas.filter(ninja => ninja.name == name)
  // res.status(200).json(resultado)

//================================================================
//================================================================

  /** MODO DINAMICO - filtros dinamicos */

  // Primeiro recebemos os parametros e tranformamos em 'constantes' -- desestruturação de objeto.
  const { id, name, country, age, style } = req.query;

  // Salvamos os filtros e seus respectivos valores em um array chamado filtros.
  // obs: poderiamos usar Object.entries/Object.keys, mas assim a visualização dos filtros fica mais fácil (preguiçoso, mas eficaz).
  const filtros: { chave: keyof NinjaProps; valor: any }[] = [
    { chave: 'id', valor: id },
    { chave: 'name', valor: name },
    { chave: 'country', valor: country },
    { chave: 'age', valor: age },
    { chave: 'style', valor: style }
  ];

  //console.log(ninjas)

  // Vamos salvar na constante resultado somente o que passar pelo filter
  const resultado = parsedNinjas.filter((item) => {

    // Primeiro filtramos os filtros válidos, ou seja, que têm valor definido e não vazio
    const filtrosValidos = filtros.filter(f => f.valor !== undefined && f.valor !== "");

    // Se não houver nenhum filtro válido, retorna o item direto (traz todos os ninjas)
    if (filtrosValidos.length === 0) return true;

    // percorremos o array de filtros válidos
    for (let filtro of filtrosValidos) {

      // o item filtro vai ter as duas propriedades, chave e valor - desestruturação de objeto.
      const { chave, valor } = filtro;

      // a constante campo recebe o valor do objeto em questão com base na chave. 
      const campo = item[chave as keyof NinjaProps];

      // Se o campo for do tipo string precisamos fazer uma validação mais 'fina'
      // garantir compatibilidade (maiúsculas e minúsculas)
      // O que talvez seria resolvido só com um '==' em vez de '===', mas vale a garantia rs
      if (typeof campo === "string") {
        if (!campo.toLowerCase().includes(String(valor).toLowerCase())) {
          return false;
        }
      }

      // por final comparamos 
      else {
        if (String(campo) !== String(valor)) {
          return false;
        }
      }
    }

    // se passar por todas as validações acima, é show papai seu item existe!
    return true;
  });

  res.status(200).json({ ninjas: resultado });
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
