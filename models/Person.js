
const mongooseUniqueValidator = require('mongoose-unique-validator')

const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minLength: 5
    },
    phone:{
        type:String,
        minLength:4
    },
    street:{
        type:String,
        required:true,
        minLength:5
    },
    city:{
        type:String,
        required:true,
        minLength:3
    }
})

personSchema.plugin(mongooseUniqueValidator)
const Person = mongoose.model('Person', personSchema)


module.exports = Person
