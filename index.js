const express = require("express");

const server = express();

server.use(express.json());

const users = ["roberto", "nunes", "gabe"];

// middleware global com logs
server.use((req, res, next) => {
  console.time("request time");
  console.log(`Método: ${req.method}; \nURL: ${req.url};`);

  next();

  console.timeEnd("request time");
});

//midleware local, checa se o nome foi enviado
function checkUserExist(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }

  return next();
}

// middleware pra checar se tem index,
// cria uma variavel user para facilitar o retorno da rota
function checkUserInArray(req, res, next) {
  const user = users[req.params.index];
  if (!user) {
    return res.status(400).json({ error: "User doesn`t exists" });
  }
  req.user = user;

  return next();
}

//CRUD
server.get("/users", (req, res) => {
  return res.json(users);
});

server.get("/users/:index", checkUserInArray, (req, res) => {
  return res.send(req.user);
});

server.post("/users", checkUserExist, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

server.put("/users/:index", checkUserExist, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

server.listen(3000);
