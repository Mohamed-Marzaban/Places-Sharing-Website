const { validationResult } = require('express-validator')
const HttpError = require('../models/http-error')
const getCoordsForAddress = require('../util/location')
const placeModel = require('../models/placesModel')
const userModel = require('../models/usersModel')
const { default: mongoose } = require('mongoose')
const fs = require('fs')


const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;
    try {
        place = await placeModel.findById(placeId)

    }
    catch (error) {
        console.log(error)
        return next(new HttpError('Something went wrong,Could not find a place ', 500))
    }
    if (!place)
        return next(new HttpError('Could not find a place for the provided id.', 404))

    res.json({ place })
}


const getPlacesByUserid = async (req, res, next) => {
    const uid = req.params.uid
    let place;
    try {
        place = await placeModel.find({ creator: uid })

    }
    catch (error) {
        console.log(error)
        return next(new HttpError('Something went wrong while fetching places by user id', 500))
    }
    if (!place || place.length === 0)
        return next(new HttpError('Could not find a place for the provided user id.', 404))

    res.json({ place: place })
}


const createPlace = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed , please check your data.', 422))
    }
    const { title, description, address, creator } = req.body;
    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address)

    }
    catch (error) {
        return next(error)
    }
    const createdPlace = new placeModel({
        title,
        description,
        location: coordinates,
        address,
        image: 'http://localhost:5000/' + req.file.path,
        creator
    })


    let user;
    try {
        user = await userModel.findById(creator)
        console.log(user)
    }
    catch (error) {
        console.log(error)
        return next(new HttpError('Creating place failed please try again', 500))

    }
    if (!user)
        return next(new HttpError('Could not find user with the provided id', 404))
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        await createdPlace.save({ session })
        user.places.push(createdPlace)
        await user.save({ session })
        await session.commitTransaction()
    }
    catch (error) {
        await session.abortTransaction()
        console.log(error)
        return next(new HttpError('Creating place failed please try again', 500))
    }
    finally {
        session.endSession()

    }



    return res.status(201).json({ place: createdPlace })

}

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed , please check your data.', 422))
    }
    const { title, description } = req.body;

    const pid = req.params.pid

    let place;
    try {
        place = await placeModel.findById(pid)
    }
    catch (error) {
        console.log(error)
        return next(new HttpError('Something went wrong while updating place', 500))
    }
    place.title = title;
    place.description = description

    try {
        await place.save();

    }
    catch (error) {
        console.log(error)
        return next(new HttpError('Could not update place', 500))
    }


    res.status(200).json({ place })



}

const deletePlace = async (req, res, next) => {
    const pid = req.params.pid
    let place;
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        place = await placeModel.findByIdAndDelete(pid, { session }).populate('creator')
        place.creator.places.pull(place)
        await place.creator.save({ session })
        await session.commitTransaction()

    }
    catch (error) {
        await session.abortTransaction()
        if (!place)
            return next(new HttpError('Could not find place', 404))
        console.log(error)
        return next(new HttpError('Could not delete something went wrong', 500))
    }
    finally {
        session.endSession()
    }
    fs.unlink(place.image.slice(22), (error) => {
        console.log(error)
    })


    res.status(200).json({ message: 'Deleted place.' })
}

module.exports = { getPlaceById, getPlacesByUserid, createPlace, updatePlace, deletePlace }