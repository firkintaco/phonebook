const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
// Port variable
const PORT = 3001 || process.env.PORT;
// Middleware
app.use(cors());
app.use(express.json());
morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});
app.use(express.static("build"));

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// Get data from mongo
app.get("/api/persons", (req, res) => {
  Person.find({}).then((dbres) => {
    res.json(dbres);
  });
});

// Näyttää yksinkertaisen infosivun
app.get("/info", (req, res) => {
  const day = new Date();

  Person.find({}).then((dbres) => {
    res.send(`Phonebook has info for ${dbres.length} people<br/>${day}`);
  });
});

// Yksittäisen henkilön hakeminen listasta
app.get("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;
  Person.findById(id)
    .then((foundPerson) => {
      if (foundPerson) {
        res.json(foundPerson);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
  // const person = persons.find((person) => person.id === Number(id));
  // console.log(person);
  // if (!person) {
  //   res.status(404).end();
  // }
  // res.status(200).json(person);
});

// Yksittäisen henkilön poistaminen listalta
app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch((error) => next(error));
  // const id = Number(req.params.id);
  // persons = persons.filter((person) => person.id !== id);
  // res.status(204).end();
});

// Henkilön lisääminen
app.post("/api/persons/", (req, res, next) => {
  console.log(req.body);
  const { name, number } = req.body;
  // if (!name || !number) {
  //   return res.status(400).json({ error: "missing data" });
  // }
  // if (persons.find((person) => person.name === name)) {
  //   return res.status(400).json({ error: "name must be unique" });
  // }

  // Pusketaan data tietokantakaan
  const person = new Person({ name, number });
  person
    .save()
    .then((dbres) => res.status(201).json(dbres))
    .catch((error) => next(error));
});

// PUT Henkilön muokkaaminen
app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;
  const id = req.params.id;

  Person.findByIdAndUpdate(
    id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((error) => next(error));
});

// Virheidenkäsittelijä
const errorHandler = (error, req, res, next) => {
  console.log(error.name);
  if (error.name === "CastError") {
    return res.status(400).json({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};
// Määritetään errorHandleri middlewareksi
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
