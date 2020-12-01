const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

let addCat = Joi.object({
    name : Joi.string().required(),
    parentCategory : Joi.objectId()
})

// let login = Joi.object({
//     email : Joi.string().email().required(),
//     password : Joi.string().required()
// })

module.exports = {
    addCat
}