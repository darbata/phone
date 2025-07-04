const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))

let persons = [
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
]



// end points
app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${Date().toString()}</p>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person).end()
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const {name, number} = request.body

    if (!name || !number) {
        return response.status(400).json({ error: 'Name and number are required' });
    }

    const nameConflict = persons.find(p => p.name === name);

    if (nameConflict) {
        return response.status(409).json({error: 'Name must be unique'});
    } 

    const maxId = persons.length > 0
        ? Math.max(...persons.map(p => Number(p.id)))
        : 0

    const newPerson = {
        id: String(maxId + 1),
        name,
        number,
    };

    persons = persons.concat(newPerson)
    response.status(201).json(newPerson);
})

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`App running ${PORT}`)
});