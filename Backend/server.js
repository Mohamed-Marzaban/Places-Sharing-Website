const express = require('express');
const HttpError = require('./models/http-error')
const mongoose = require('mongoose')
const placesRoutes = require('./routes/places-routes')
const usersRoutes = require('./routes/users-routes')
const app = express();

app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin , X-Requested-With , Content-Type , Accept , Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,PATCH,DELETE')
    next();
})
app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);
app.use((req, res, next) => {
    return next(new HttpError('Could not find this route.', 404))
})
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500).json({ message: error.message || 'An unknown error occured!' });
})

mongoose.connect('mongodb+srv://marzban:iyqmiWumzSNIzhWj@nodetuts.pd4zq.mongodb.net/mern').then(() => {
    console.log('Connected to database ✅')
    app.listen(5000, () => {
        console.log(`Server is running on port 5000 🚀`)
    });

}).catch(error => console.log(error))

