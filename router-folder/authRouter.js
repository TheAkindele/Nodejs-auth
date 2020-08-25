const express = require('express')
var bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()
const userAuthSchema = require('../models/authModel')
const { userValidation, loginValidation } = require('../validation')

//CRUD here
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body

    //First we validate the user register input
    const { error } = await userValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    //then we check if the user already exist or not
    const checkEmail = await userAuthSchema.findOne({ email: req.body.email })
    if (checkEmail) return res.status(400).send('Email already in use')

    //a. then we hash/encrypt password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)



    //then we create our new user upon validation, and hashing p/word
    const newUser = await new userAuthSchema({
        name: name,
        email: email,
        password: hashPassword
    })

    try {
        const addedUser = await newUser.save()
        res.send(addedUser)
        res.end()
    } catch (error) {
        res.status(400).json({ msg: 'unable to create user', error })
    }
})

// To make a login request
router.post('/login', async (req, res) => {
    const { email, password } = req.body

    //first validate input
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    //then check if user/email exist
    const userExist = await userAuthSchema.findOne({ email })
    if (!userExist) return res.status(404).send('User not found')

    //then we check and compare the given password
    const comparePassword = await bcrypt.compare(password, userExist.password)
    if (!comparePassword) return res.status(400).send('Incorrect password input')

    //Now we get the logged user token
    const userId = userExist._id
    const token = await jwt.sign({ id: userId }, process.env.TOKEN_SECRET)
    res.header('auth-token', token)
    res.send(`user ${userId} has token ${token}`)

})

module.exports = router
