require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('post-string', (req, res) => {
    const j = JSON.stringify(req.body)
    if(j === JSON.stringify({}))
        return ''
    else
        return j
})
app.use(morgan(':method :url :status :req[body] :response-time ms :post-string'))


app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/info', (req, res) => {
    Person.find({}).then(persons => {
        res.send(`<p> The Phonbook has info for ${persons.length} people</p>
        <br/>
        <p>${Date()}</p>`)  
    })
})

app.get('/api/persons/:id' , (req, res) => {
    Person.findById(req.params.id).then(person => {
        res.json(person)
    }).catch(e => {
        res.status(404).end()
    })
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    if(!body.name) {
        return res.status(400).json({
            error: 'Name Missing'
        })
    }

    else if(!body.number) {
        return res.status(400).json({
            error : 'Number missing'
        })
    }

    // Person.find({name: body.name}).then(person => {
    //     return res.status(406).json({
    //         error: 'Name existing in phonebook, Must be unique'
    //     })
    // })

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})


app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.param.id)
    persons.filter(p => p.id !== id)
    
    res.status(204).end()
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})