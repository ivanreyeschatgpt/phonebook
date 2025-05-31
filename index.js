require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const app = express()

const cors = require('cors')

app.use(cors())


/* let persons = [
  
        { 
          "id": "1",
          "name": "Arto Hellas", 
          "number": "040-123456"
        },
        { 
          "id": "2",
          "name": "Ada Lovelace", 
          "number": "39-44-5323523"
        },
        { 
          "id": "3",
          "name": "Dan Abramov", 
          "number": "12-43-234345"
        },
        { 
          "id": "4",
          "name": "Mary Poppendieck", 
          "number": "39-23-6423122"
        }

    ] */

app.use(express.json())

app.use(express.static('dist'))

// const persons_length= persons.length

/* 
app.get('/info', (request, response) => {
  const now = new Date();
  response.send(`<h1>Phonebook has info for ${persons_length} people<\h1>  ${now}`)
}) */

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons=>{
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {

    if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }

  })})


/* app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter((person) => person.id !== id)
  
    response.status(204).end()
  })
 */

  app.post('/api/persons', (request, response, next) => {
  const body = request.body

    const person = new Person({
      name: body.name,
      number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))

})


app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})




const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)






const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})