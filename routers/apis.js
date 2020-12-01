const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

/********* import controllers ********/
const categoryController = require('../controllers/category');
const commonController = require('../controllers/common');
const productController = require('../controllers/product');

/*******************************************************************************
Configuration for MULTER (image upload).
*******************************************************************************/
let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads')
    },
    filename: function (req, file, callback) {
        let fileName = path.parse(file.originalname).name;
        callback(null, fileName + '-' + Date.now() + path.extname(file.originalname))
    }
})
let upload = multer({ storage: storage });

/********* Routes *********/
router.post('/category/add', categoryController.addCategory);
router.get('/category/list', categoryController.subCategoryList);

router.post('/uploads', upload.array('image'), commonController.uploadImage);

/******* products *******/
router.post('/product/add', productController.addProduct);
router.post('/product/edit/:id', productController.editProduct);
router.post('/product/list', productController.getProductList);

module.exports = router;