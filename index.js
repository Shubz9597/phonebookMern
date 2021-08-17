const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

const persons = [
        {
            id: 1,
            name: "Arto Hellas",
            number: "040-23456"
        },

        {
            id: 2,
            name: "Shubham Misra",
            number: "9732-234523"
        },

        {
            id: 3,
            name: "Mary Lovelace",
            number: "054-3546223"
        },

        {
            id: 4,
            name: "Blue Stones",
            number: "101-786619"
        }
]

morgan.token('post-string', (req, res) => {
    const j = JSON.stringify(req.body)
    if(j === JSON.stringify({}))
        return ''
    else
        return j
})
app.use(morgan(':method :url "status :req[body] :response-time ms :post-string'))

const generateId = () => {
    return ( 5 + (Math.random()) * 1000)
}

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(`<p> The Phonbook has info for ${persons.length} people</p>
    <br/>
    <p>${Date()}</p>`)
})

app.get('/api/persons/:id' , (req, res) => {
    const id = Number(req.params.id)
    if(persons.find(n => n.id === id))
    {
        const person = persons.filter(n => n.id === id)
        return res.json(person)
    }

    res.status(400).json(
    {
        error : 'No Note found'   
    })
})

app.post('/api/persons', (req, res) => {
    console.log(req.body)
    const bodya = req.body
    if(!bodya.name) {
        return res.status(400).json({
            error: 'Name Missing'
        })
    }

    else if(!bodya.number) {
        return res.status(400).json({
            error : 'Number missing'
        })
    }

    else if(persons.find(p => p.name === bodya.name)) {
        return res.status(406).json({
            error: 'Name existing in phonebook, Must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: bodya.name,
        number: bodya.number
    }
    res.json(person)
    // persons = persons.concat(person)

    // res.json(persons)
    
})


app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.param.id)
    persons.filter(p => p.id !== id)
    
    res.status(204).end()
})



app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>')
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})