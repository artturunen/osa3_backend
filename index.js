const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(cors())

morgan.token('postData', (req) => {
    if (req.method === 'POST') {
      return JSON.stringify(req.body)
    } else {
        return ''
    }
})

//app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));
app.use(express.json())
app.use(express.static('dist'))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-1234567"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "050-123456"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "060-123456"
  },
  {
    id: 4,
    name: "Mary Poppenddick",
    number: "070-123456"
  }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    const lkm = persons.length
    const now = new Date()
    res.send(`<div>Phonebook has info for ${lkm} people</div>
              <div>${now}</div>`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})
  
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * 100000)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }

    const exists = persons.some(person => person.name === body.name)
    if (exists) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })  
    }

    if (!body.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }
  
    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})