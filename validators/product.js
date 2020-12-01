const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

let addPro = Joi.object({
    name : Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    images: Joi.array().required(),
    categoryId : Joi.objectId().required()
})

let editPro = Joi.object({
    name : Joi.string(),
    description: Joi.string(),
    price: Joi.number(),
    images: Joi.array(),
    categoryId : Joi.objectId(),
    // id: Joi.objectId()
})

module.exports = {
    addPro,
    editPro
}