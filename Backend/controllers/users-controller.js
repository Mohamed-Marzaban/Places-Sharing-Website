const HttpError = require('../models/http-error')
const { validationResult } = require('express-validator')
const userModel = require('../models/usersModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12)

    }
    catch (error) {
        return next(new HttpError('Could not create user,try again later', 500))
    }
    const createdUser = new userModel({

        name,
        email,
        password: hashedPassword,
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

    let token;
    try {
        token = jwt.sign({ userId: createdUser._id, email: createdUser.email }, 'supersecret_dont_share', { expiresIn: '1h' })

    }
    catch (error) {
        return next(new HttpError('Something went wrong while signing up', 500))

    }

    res.status(201).json({ userId: createdUser._id, email: createdUser.email, token })

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


    if (!identifiedUser)
        return next(new HttpError('Could not identify user, credentials seem to be wrong', 401))

    let isValidPassword;
    try { isValidPassword = await bcrypt.compare(password, identifiedUser.password) }
    catch (error) {
        return next(new HttpError('Could not log you in,please check your credentials', 500))
    }
    if (!isValidPassword)
        return next(new HttpError('Invalid credentials,could not log you in', 401))
    let token;
    try {
        token = jwt.sign({ userId: identifiedUser._id, email: identifiedUser.email }, 'supersecret_dont_share', { expiresIn: '1h' })

    }
    catch (error) {
        return next(new HttpError('Something went wrong while logging in', 500))

    }
    res.status(200).json({ userId: identifiedUser._id, email: identifiedUser.email, token })
}

module.exports = { getUsers, signup, login }
