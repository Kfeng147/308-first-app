import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const users = {
    users_list: [
      {
        id: "xyz789",
        name: "Charlie",
        job: "Janitor"
      },
      {
        id: "abc123",
        name: "Mac",
        job: "Bouncer"
      },
      {
        id: "ppp222",
        name: "Mac",
        job: "Professor"
      },
      {
        id: "yat999",
        name: "Dee",
        job: "Aspring actress"
      },
      {
        id: "zap555",
        name: "Dennis",
        job: "Bartender"
      }
    ]
};

// P2, generate random ID
function generateRandomId() {
    return Math.random().toString(36).substring(2, 8);
}

const deleteUser = (id) => {
    users["users_list"] = users["users_list"].filter(
      (user) => user["id"] !== id   // update users_list but exclude the user with the specified id
    );
}

const addUser = (user) => {
    users["users_list"].push(user);
    return user;
}

const findUserByName = (name) => {
    return users["users_list"].filter(
      (user) => user["name"] === name
    );
};

const findUserById = (id) => 
    users["users_list"].find((user) => user["id"] === id);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users/:id", (req, res) => {
    const id = req.params.id;
    let result = findUserById(id);
    if (result === undefined) { 
      res.status(404).send({ message: `user with id ${id} not found` });
    } else {
        res.send(result);
    }
  }
);

app.get("/users", (req, res) => {
    const name = req.query.name;
    if (name != undefined) {
      let result = findUserByName(name);
      result = { users_list: result };
      res.send(result);
    } else {
      res.send(users);
    }
  });

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    userToAdd["id"] = generateRandomId();   // P2, assign random id to the new user
    addUser(userToAdd);
    res.status(201).send(userToAdd); // P1, send 201 and P3, send updated representation of object with new id
    }
);

app.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    const userExists = findUserById(id);
    // check if the userid even exists first
    if (userExists === undefined) {
      res.status(404).send({ message: `user with id ${id} not found` }); // P3, send 404 if user not found
      return;
    }

    deleteUser(id);
    res.status(204).send({ message: `user with id ${id} deleted` }); // P3, send 204 to represent successful deletion
  }
);

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});