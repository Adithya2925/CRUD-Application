const express = require("express")
const users = require("./sample.json")
const cors = require("cors")
const fs = require("fs");
const app = express();

port = 3000;

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PATCH", "DELETE"],
    })
);
app.use(express.json());
app.get('/user', (req, res) => {
    res.json(users)
})

// Add User
app.post("/user", (req, res) => {
    let { name, age, city } = req.body;
    if (!name || !age || !city) {
        return res.status(400).send({ message: "All fields are required" });
    }
    let id = Date.now();
    users.push({ id, name, age, city });
    fs.writeFile("./sample.json", JSON.stringify(users), (err, data) => {
        return res.json({ message: "User Detail Added Success" });
    });
});

// Update User
app.patch("/user/:id", (req, res) => {
    let id = Number(req.params.id);
    let { name, age, city } = req.body;
    if (!name || !age || !city) {
        return res.status(400).send({ message: "All fields are required" });
    }
    let index = users.findIndex((user) => user.id == id);
    users.splice(index, 1, { id, name, age, city });
    fs.writeFile("./sample.json", JSON.stringify(users), (err, data) => {
        return res.json({ message: "User Detail Updated Success" });
    });
});

app.delete('/user/:id', (req, res) => {
    let id = Number(req.params.id);
    let index = users.findIndex((user) => user.id == id);
    users.splice(index, 1);
    fs.writeFile("./sample.json", JSON.stringify(users), (err, data) => {
        return res.json(users);
    })
})

app.listen(port, (err) => {
    console.log(`Server is run http://localhost:${port}`)
})