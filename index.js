require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const { response } = require('express')

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

app.get('/api/persons/:id' , (req, res, next) => {
    Person.findById(req.params.id)
    .then(person => {
        if(person){
            res.json(person)
        } else {
            res.status(404).end()
        }
    }).catch(error => next(error))
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

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})


app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
        res.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(updatedContact => {
            response.json(updatedContact)
        })
        .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({error : 'UnknownEndpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request , response, next) => {
    console.log(error)

    if(error.name === 'CastError'){
        return response.status(400).send({error : 'malformatted id'})
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})