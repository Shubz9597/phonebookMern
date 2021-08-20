const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}
const password = process.argv[2]
const url = `mongodb+srv://phoneBookman:${password}@cluster0.7usrw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length < 4){
    return Person.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}


const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
})


person.save().then(result => {
    console.log(`Added ${process.argv[3]} Number ${process.argv[4]} to the phonebook`)
    mongoose.connection.close()
})


