import mongoose from "mongoose";

mongoose.set("strictQuery", false);

/* const personSchema = new mongoose.Schema({
  name: {    
    type: String,    
    minLength: 3,    
    required: true  
  },
  number: String,
}) */

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Expresión regular para validar el formato del número de teléfono
        const phoneRegex = /^\d{2,3}-\d{7}/;

        // Verificar si el número de teléfono cumple con el formato deseado
        return phoneRegex.test(value);
      },
      message:
        'Invalid phone number format. Must be "xx-xxxxxxx".',
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", personSchema);

export default Person;
