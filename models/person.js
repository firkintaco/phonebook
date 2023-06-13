require("dotenv").config();
const mongoose = require("mongoose");
const url = process.env.MONGO_URI;

// MongoDB Connect
mongoose
  .connect(url)
  .then((res) => {
    console.log("Succesfully connected to mongoDB ATLAS");
  })
  .catch((err) => console.log("Error connecting to MongoDB:", err.message));

// MongoDB Schema
const personSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 4 },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: function (v) {
        return /\d{3}-\d{7}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, "phone number required"],
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
