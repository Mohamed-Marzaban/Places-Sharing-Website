const { validationResult } = require('express-validator')
const HttpError = require('../models/http-error')
const { v4: uuidv4 } = require('uuid')
const getCoordsForAddress = require('../util/location')
let DUMMY_PLACES = [{
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    location: {
        lat: 40.7484474,
        lng: -73.9871516

    },
    address: '20 W 34th St , New York ,NY 10001',
    creator: 'u1'
}]


const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(e => (e.id === placeId))
    if (!place)
        return next(new HttpError('Could not find a place for the provided id.', 404))

    res.json({ place })
}


const getPlacesByUserid = (req, res, next) => {
    const uid = req.params.uid
    console.log(DUMMY_PLACES)
    const place = DUMMY_PLACES.filter(p => (uid === p.creator))
    if (!place || getPlacesByUserid.length === 0)
        return next(new HttpError('Could not find a place for the provided user id.', 404))

    res.json({ place })
}


const createPlace = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed , please check your data.', 422))
    }
    const { title, description, address } = req.body;
    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address)

    }
    catch (error) {
        return next(error)
    }
    const createdPlace = {
        id: uuidv4(),
        title,
        description,
        location: coordinates,
        address,
        creator: 'u2'
    }
    DUMMY_PLACES.push(createdPlace)

    console.log(DUMMY_PLACES)
    return res.status(201).json({ place: createdPlace })

}

const updatePlace = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed , please check your data.', 422))
    }
    const { title, description } = req.body;

    const pid = req.params.pid

    const place = { ...DUMMY_PLACES.find((p) => (p.id === pid)) }

    const placeIndex = DUMMY_PLACES.findIndex(p => (pid === p.id))

    place.title = title;
    place.description = description

    DUMMY_PLACES[placeIndex] = place

    res.status(200).json({ place })



}

const deletePlace = (req, res, next) => {
    const pid = req.params.pid
    if (!DUMMY_PLACES.find(p => (p.id === pid)))
        return next(new HttpError('Could not find place', 404))

    DUMMY_PLACES = DUMMY_PLACES.filter(p => (p.id !== pid))
    res.status(200).json({ message: 'Deleted place.' })
}

module.exports = { getPlaceById, getPlacesByUserid, createPlace, updatePlace, deletePlace }