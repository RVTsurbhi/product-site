const mongoose = require('mongoose')

let Counter = mongoose.Schema(
    {   
        key:{type: String, default:'tag'},
        seq: {type : Number, default:0}
    }
)

module.exports = mongoose.model('Counter', Counter );