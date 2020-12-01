/******* Models *********/
const CategoryModel = require('../models/category');

/******** Helpers **********/
const { addCat } = require('../validators/category');
const responseHelper = require('../helpers/responses');

/************************************/
/*********** Controllers ************/
/************************************/

/* Register user */
const addCategory = async(req, res, next)=>{
    try{
        let categoryForm = await addCat.validateAsync(req.body)
        let queryObj = { name : categoryForm.name }
        if(categoryForm.parentCategory){
            queryObj['parentCategory'] = categoryForm.parentCategory 
        }
        let catInfo = await CategoryModel.findOne(categoryForm)
        if(catInfo){
            throw Error("Category Already exist");
        }else {
            let categoryData = await new CategoryModel(req.body).save()
            // categoryData.save()
            if(categoryForm.parentCategory){   
                await CategoryModel.findOneAndUpdate({_id : categoryForm.parentCategory},{ $push: { subcategory : categoryData._id } }, {useFindAndModify : false})
            }
            responseHelper.data(res, categoryData, 200, "Category created successfully.");
        } 
    }catch(err){
        next(err);
    }
}

/* fetch subcategories */
const subCategoryList = async(req, res, next)=>{
    try{
        let subCategories = await CategoryModel.findOne({_id : req.query.categoryId})
        .populate({path: 'subcategory', select: 'name _id'})
        responseHelper.data(res, subCategories, 200, "Category list");
    }catch(err){
        next(err)
    }
}

module.exports = {
    addCategory,
    subCategoryList
}