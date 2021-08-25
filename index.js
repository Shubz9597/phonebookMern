require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('post-string', (request , response) => {
	const j = JSON.stringify(request.body)
	if(j === JSON.stringify({}))
		return ''
	else
		return j
})
app.use(morgan(':method :url :status :req[body] :response-time ms :post-string'))


app.get('/api/persons', (request, response) => {
	Person.find({}).then(persons => {
		response.json(persons)
	})
})

app.get('/info', (request, response) => {
	Person.find({}).then(persons => {
		response.send(`<p> The Phonbook has info for ${persons.length} people</p>
        <br/>
        <p>${Date()}</p>`)
	})
})

app.get('/api/persons/:id' , (request, response, next) => {
	Person.findById(request.params.id)
		.then(person => {
			if(person){
				response.json(person)
			} else {
				response.status(404).end()
			}
		}).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
	const body = request.body

	const person = new Person({
		name: body.name,
		number: body.number
	})

	person.save().then(savedPerson => {
		response.json(savedPerson)
	})
		.catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then(result => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body

	const person = {
		name: body.name,
		number: body.number
	}

	Person.findByIdAndUpdate(request.params.id, person, { new: true })
		.then(updatedContact => {
			response.json(updatedContact)
		})
		.catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
	response.status(404).send({ error : 'UnknownEndpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request , response, next) => {
	console.log(error)

	if(error.name === 'CastError'){
		return response.status(400).send({ error : 'malformatted id' })
	} else if(error.name === 'ValidationError'){
		return response.status(400).json({ error: error.message })
	}
	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})