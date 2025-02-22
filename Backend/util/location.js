const API_KEY = 'AIzaSyB6e8STMrA2cM0kYfvWF136uZkmawjaiP8'
const axios = require('axios')
const HttpError = require('../models/http-error')
async function getCoordsForAddress(address) {

    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`)

    const data = response.data

    if (!data || data.status === 'ZERO_RESULTS') {
        throw new HttpError('Could not find location for the specified address.', 404)
    }

    const coordinates = data.results[0].geometry.location

    return coordinates


}

module.exports = getCoordsForAddress
