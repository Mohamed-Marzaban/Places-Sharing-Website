const mongoose = require('mongoose')


const placesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    location: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Place', placesSchema)