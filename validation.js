const Joi = require('joi')

//to validate a new user, we say
const userValidation = data => {
    const registerValidationSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().alphanum().min(4).required()
    })
    return registerValidationSchema.validate(data)
}

//we create the login validation
const loginValidation = data => {
    const loginValidationSchema = Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().alphanum().min(4).required()
    })
    return loginValidationSchema.validate(data)
}

module.exports = { userValidation, loginValidation }
