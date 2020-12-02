const mongoose = require('mongoose')

let Product = mongoose.Schema(
    {
        categoryId : {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
        name: {type : String, default:''},
        description: {type : String, default:''},
        price: {type : Number, default:0},
        images: {type : Array, default:[]},
        tagId: {type : Number, default:0},
        slug:{type : String, unique : true},
        createdAt: { type : Date, default : Date.now() },
        updatedAt: { type : Date, default : Date.now() }
    }
)

module.exports = mongoose.model('Product', Product );