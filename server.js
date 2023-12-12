import express from 'express'
import { config } from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import Person from './src/models/person.js'

config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(cors())

// Mongodb connection
const url = process.env.MONGODB_URI
mongoose.set('strictQuery', false)

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// Endpoints
app.get('/', (req, res) => {
  res.end('<h2>FullStack Helsinki Part3!</h2>')
})

app.get('/info', (request, response) => {
  request.requestTime = new Date()
  // Build response
  const entries = Person.length
  const resp = `
    <p>Request Time: ${request.requestTime}</p>
    <p>PhoneBook has info to ${entries} people</p>
  `
  // Send response to client
  response.send(resp)
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons)
  })
})

app.post('/api/persons', async (request, response, next) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  try {
    // Check if a person with the same content already exists
    const existingPerson = await Person.findOne({ name: body.name })

    if (existingPerson) {
      return response
        .status(400)
        .json({ error: 'person with the same content already exists' })
    }
    const person = new Person({
      name: body.name,
      number: body.number
    })

    person
      .save()
      .then((savedPerson) => {
        response.json(savedPerson)
      })
      .catch((error) => next(error))
  } catch (error) {
    console.error('Error saving note:', error)
    response.status(500).json({ message: 'Internal Server Error' })
  }
})

/* const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint) */

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    /* .catch(error => {
    console.log(error)
    //response.status(500).end()
    response.status(400).send({ error: 'malformatted id' })
    }) */
    .catch((error) => next(error))
})

/* app.delete("/api/persons/:id", async (req, res) => {
  const idToDelete = req.params.id;
  try {
    const deletedPerson = await Person.findByIdAndDelete(idToDelete);

    if (deletedPerson) {
      res.json({ message: "Person deleted successfully", deletedPerson });
    } else {
      res.status(404).json({ message: "Person not found" });
    }
  } catch (error) {
    console.error("Error deleting person:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}); */

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      // res.status(204).end();
      res.json({ message: 'Person deleted successfully' })
    })
    .catch(error => next(error))
})

/* app.put("/api/persons/:id", async (req, res) => {
  const idToUpdate = req.params.id;
  const { name, number } = req.body;

  try {
    const updatedPerson = await Person.findByIdAndUpdate(idToUpdate, {
      name,
      number,
    });

    if (updatedPerson) {
      res.json({ message: "Person updated successfully", updatedPerson });
    } else {
      res.status(404).json({ message: "Person not found" });
    }
  } catch (error) {
    console.error("Error updating person:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}); */

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findByIdAndUpdate(
    req.params.id,

    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
