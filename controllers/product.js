/******* Models *********/
const ProductModel = require('../models/product');
const CounterModel = require('../models/counter');

/********3rd party modules ********/
var slugify = require('slugify')

/******** Helpers **********/
const { addPro, editPro } = require('../validators/product');
const responseHelper = require('../helpers/responses');

/************************************/
/*********** Controllers ************/
/************************************/

/* api to create group */
const addProduct = async(req, res, next)=>{
    try{
        let productForm = await addPro.validateAsync(req.body)
        let title = slugify(productForm.name, {
            replacement: '-',
            lower: true
        })
        productForm.slug = title +'-' + Date.now()
        productForm.tagId = await getNextSequence('tag')
        let productData = await new ProductModel(productForm).save()
        responseHelper.data(res, productData, 200, "Product created successfully.");
    }catch(err){
        next(err);
    }
}

/* update product */
const editProduct = async(req, res, next)=>{
    try{
        let productForm = await editPro.validateAsync(req.body)
        let productData = await ProductModel.findOne({_id: req.params.id})
        if(!productData){
            throw Error('Product not found');
        } else {
            productData.price = productForm.price || productData.price
            productData.name = productForm.name || productData.name
            productData.description = productForm.description || productData.description
            productData.images = productForm.images || productData.images
            productData.categoryId = productForm.categoryId || productData.categoryId

            await productData.save()
            responseHelper.data(res, productData, 200, "Product updated successfully.");
        }
    }catch(err){
        next(err);
    }
}

/* product list */
const getProductList = async(req, res, next)=>{
    try{
        let queryObj={};
        let skip = parseInt(req.query.skip) || 0
        let limit = parseInt(req.query.limit) || 10
        if(req.query.categoryId){
            queryObj['categoryId'] = req.query.categoryId
        }
        let productData = await ProductModel.find(queryObj).select('name description slug price images').skip(skip).limit(limit)
        let totalProduct = await ProductModel.countDocuments(queryObj)
        responseHelper.page(res, productData, totalProduct, skip, 200)
    }catch(err){
        next(err);
    }
}

/* product detail */
const getProductById = async(req, res, next)=>{
    try{
        let productData = await ProductModel.findOne({slug: req.query.slug})
        .populate({
            path:'categoryId', 
            select: 'name',
            populate: {
                path : 'parentCategory',
                select: 'name',
                populate: {
                    path : 'parentCategory',
                    select: 'name'
                }
            }
        })
        if(!productData){
            throw Error('Product does not exist');
        }
        responseHelper.data(res, productData, 200, "Product detail.");
    }catch(err){
        next(err);
    }
}

//auto increment
let getNextSequence = async (name) =>{
    try{
        let count = await CounterModel.findOneAndUpdate(
            { key: name}, { $inc: { seq: 1 } },{new: true}
        );
        if(!count){
            let newCount = await new CounterModel({key: "tag", seq: 0}).save()
            console.log('ret-1', newCount.seq)
            return newCount.seq;
        }else {
            console.log('ret', count.seq)
            return count.seq;
        }
    }catch(err){
        return err;
    }
 }

module.exports = {
    addProduct,
    editProduct,
    getProductList,
    getProductById
}