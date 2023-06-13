require("dotenv").config();
const mongoose = require("mongoose");
const url = process.env.MONGO_URI;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv[2]) {
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3],
  });
  person.save().then((res) => {
    console.log(`Added ${res.name} number ${res.number} to phonebook`);
    console.log(res);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((res) => {
    console.log("phonebook:");
    res.forEach((person) => console.log(person.name, person.number));
    mongoose.connection.close();
  });
}
