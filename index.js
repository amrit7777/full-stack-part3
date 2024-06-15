const express=require('express')
const app=express()
var morgan = require('morgan')
const cors = require('cors')

app.use(cors())

app.use(express.json());

morgan.token('type', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

let Phonebook=[
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

  app.get('/api/persons', (request, response) => {
    response.json(Phonebook)
  })

app.get('/info',(request,response)=>{
    const currentTime=new Date()
    response.send(`<p>Phonebook has info for ${Phonebook.length} people<br/> ${currentTime}  </p> `)
})

app.get('/api/persons/:id',(request,response)=>{
    const id=Number(request.params.id)
    const person=Phonebook.find(person=>person.id===id)
    if(person){
    response.json(person)
    }
    else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    Phonebook = Phonebook.filter(person => person.id !== id)

    response.status(204).end()
  })


  app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'name or number missing' });
    }

    const nameExists = Phonebook.some(person => person.name === body.name);
    if (nameExists) {
        return response.status(400).json({ error: 'name must be unique' });
    }

    const newPerson = {
        id: Math.floor(Math.random() * 1000000),
        name: body.name,
        number: body.number
    };

    Phonebook = Phonebook.concat(newPerson);

    response.json(newPerson);

  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

  app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })