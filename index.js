const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const numberOfPeople = persons.length;
  response.send(
    `<p>Phonebook has info for ${numberOfPeople} people</p> <p>${new Date()}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});
app.put("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const updatedPerson = request.body; // This contains the updated data

  const personIndex = persons.findIndex((person) => person.id === id);
  if (personIndex !== -1) {
    // Update the person if found
    persons[personIndex] = { ...persons[personIndex], ...updatedPerson };
    response.json(persons[personIndex]);
  } else {
    response.status(404).send({ error: "Person not found" });
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }
  // find duplicate names
  const duplicatePerson = persons.find((person) => person.name === body.name);
  if (duplicatePerson) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }
  const person = {
    name: body.name,
    number: body.number,
    id: body.id,
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});