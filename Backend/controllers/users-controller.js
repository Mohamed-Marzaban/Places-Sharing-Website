const HttpError = require('../models/http-error')
const { validationResult } = require('express-validator')
const userModel = require('../models/usersModel')


const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await userModel.find({}, '-password')
    }
    catch (error) {
        console.log(error)
        return next(new HttpError('Could not fetch all users', 500))
    }
    console.log(users)
    return res.status(200).json({ users })
}

const signup = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed , please check your data.', 422))
    }
    const { name, email, password } = req.body

    try {
        await userModel.findOne({ email })

    }
    catch (error) {
        return next(new HttpError('Something went wrong', 500))
    }


    const createdUser = new userModel({

        name,
        email,
        password,
        image: 'http://localhost:5000/' + req.file.path,
    })
    console.log(req.file.path)

    try {
        await createdUser.save()

    }
    catch (error) {
        if (error.code === 11000)
            return next(new HttpError('Sorry this user already exists', 422))

        console.log(error)
        return next(new HttpError('Something went wrong while signing up', 500))
    }
    res.status(201).json({ user: createdUser })

}

const login = async (req, res, next) => {

    const { email, password } = req.body
    let identifiedUser
    try {
        identifiedUser = await userModel.findOne({ email })
    }
    catch (error) {
        console.log(error)
        return next(new HttpError('Logging in failed'), 500)
    }

    if (!identifiedUser || identifiedUser.password !== password)
        return next(new HttpError('Could not identify user, credentials seem to be wrong', 401))

    res.json({ user: identifiedUser })
}

module.exports = { getUsers, signup, login }
