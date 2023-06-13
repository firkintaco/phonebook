const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const PORT = 3001 || process.env.PORT;
let persons = [
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
  {
    name: "Asd",
    number: "456",
    id: 5,
  },
];
app.use(cors());
app.use(express.json());
morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.get("/api/persons", (req, res) => {
  res.json(persons);
});
app.get("/info", (req, res) => {
  const day = new Date();
  const personsLength = persons.length;

  res.send(`Phonebook has info for ${personsLength} people<br/>${day}`);
});

// Yksittäisen henkilön hakeminen listasta
app.get("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  const person = persons.find((person) => person.id === Number(id));
  console.log(person);
  if (!person) {
    res.status(404).end();
  }
  res.status(200).json(person);
});

// Yksittäisen henkilön poistaminen listalta
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

// Henkilön lisääminen
app.post("/api/persons/", (req, res) => {
  console.log(req.body);
  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(400).json({ error: "missing data" });
  }
  if (persons.find((person) => person.name === name)) {
    return res.status(400).json({ error: "name must be unique" });
  }
  const id = Math.round(Math.random() * 100);
  const newPerson = {
    name,
    number,
    id,
  };
  persons.push(newPerson);
  res.status(201).json(newPerson);
});

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
