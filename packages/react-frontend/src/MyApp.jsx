// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
    const [characters, setCharacters] = useState([]);

    // P3, change logic of removeOneCharacter to make DELETE request
    function removeOneCharacter(id) {
        deleteUser(id)
            .then((res) => {
                if (res.status === 404) // check if status code is 404 (user not found)
                    console.log(`User with id ${id} not found`);
                else if (res.status === 204)    // check if status code is 204 (successful deletion)
                    setCharacters(characters.filter((user) => user.id !== id));
                else
                    console.log("Failed to delete user"); // test other status codes
                    
            })
            .catch((error) => { console.log(error); });
    }

    function updateList(person) {
        postUser(person)
            .then((res) => {
                if (res.status === 201) // check if status code is 201
                    return res.json();
                else
                    console.log("Failed to add user"); // test other status codes
            })
            .then((newUser) => {
                setCharacters([...characters, newUser]); // P3, update state with new user
            })
            .catch((error) => { console.log(error); });
    }

    function fetchUsers() {
        const promise = fetch("http://localhost:8000/users");
        return promise;
    }

    function postUser(user) {
        const promise = fetch("http://localhost:8000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });
        return promise;
    }

    // P3, fetch with method DELETE and appended ID to route URL
    function deleteUser(id) {
        const promise = fetch(`http://localhost:8000/users/${id}`, {
            method: "DELETE"
        });
        return promise;
    }

    useEffect(() => {
        fetchUsers()
            .then((res) => res.json())
            .then((json) => setCharacters(json["users_list"]))
            .catch((error) => { console.log(error); });
      }, [] );

    return (
    <div className="container">
      <Table 
      characterData={characters}
      removeCharacter={removeOneCharacter}
      />
        <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;