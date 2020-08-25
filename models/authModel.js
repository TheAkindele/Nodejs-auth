const mongoose = require('mongoose')

const userAuthSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, min: 4 }
})

module.exports = mongoose.model('user', userAuthSchema)
