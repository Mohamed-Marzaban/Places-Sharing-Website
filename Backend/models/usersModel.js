const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    image: {
        type: String,
        required: true
    },
    places: [{
        type: mongoose.Types.ObjectId, ref: 'Place'

    }]
})

module.exports = mongoose.model('User', userSchema)