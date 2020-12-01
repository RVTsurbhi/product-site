/******* Models *********/
const ProductModel = require('../models/product');

/********3rd party modules ********/
var slugify = require('slugify')

/******** Helpers **********/
const { addPro, editPro } = require('../validators/product');
const responseHelper = require('../helpers/responses');
const { now } = require('mongoose');

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
            productData.description = productForm.price || productData.description
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
        let skip = req.query.skip || 0
        let limit = req.query.limit || 10
        if(req.query.categoryId){
            queryObj['categoryId'] = req.query.categoryId
        }
        let productData = await ProductModel.find(queryObj).select('name description price images').skip(skip).limit(limit)
        let totalProduct = await ProductModel.countDocuments(queryObj)
        responseHelper.page(res, productData, totalProduct, skip, 200)
    }catch(err){
        next(err);
    }
}

/* product detail */
const getProductById = async(req, res, next)=>{
    try{
        let productData = await ProductModel.findOne({})
        responseHelper.data(res, productData, 200, "Product created successfully.");
    }catch(err){
        next(err);
    }
}

module.exports = {
    addProduct,
    editProduct,
    getProductList,
    getProductById
}