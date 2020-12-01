const mongoose = require('mongoose')

let CategorySchema = mongoose.Schema(
    {
        name : { type : String, default:'', trim:true},
        parentCategory : {type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null},
        subcategory: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        }],
        createdAt : { type : Date, default : Date.now() },
        updatedAt : { type : Date, default : Date.now() }
    }
)

module.exports = mongoose.model('Category', CategorySchema );