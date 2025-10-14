import express from "express";
import cors from "cors";
import services from "./user-services.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users/:id", (req, res) => {
  services
    .findUserById(req.params.id)
    .then((doc) => {
      if (!doc)
        res
          .status(404)
          .send({ message: `user with id ${req.params.id} not found` });
      else res.send(doc);
    })
    .catch((error) => console.log(error));
});

app.get("/users", (req, res) => {
  const { name, job } = req.query;
  services
    .getUsers(name, job)
    .then((docs) => res.send({ users_list: docs }))
    .catch((error) => console.log(error));
});

app.post("/users", (req, res) => {
  services
    .addUser(req.body)
    .then((doc) => res.status(201).send(doc))
    .catch((error) => console.log(error));
});

app.delete("/users/:id", (req, res) => {
  services
    .deleteUser(req.params.id)
    .then((doc) => {
      if (!doc)
        res
          .status(404)
          .send({ message: `user with id ${req.params.id} not found` });
      else res.status(204).send();
    })
    .catch((error) => console.log(error));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
