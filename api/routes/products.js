const express=require('express');
const router=express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function(req, file,cb){
        cb(null,'./uploads/');
    },
    filename:function(req, file, cb){
        cb(null,`${file.originalname}`);
    }
});
// const fileFilter = (req, file, cb)=>{
//     //reject a file
//     if(file.mimeType === 'image/jpeg'|| file.mimeType==='image/png')
//     cb(null,true);
//     else{
//         cb(null, false);
//     }
// };

const upload = multer({
    storage: storage,
    limits:{
        fileSize: 1024*1024*5
    },
    // fileFilter:fileFilter
});

const { response } = require('../../app');

const Product = require('../models/product');

router.get('/',ProductsController.products_get_all);

router.post('/', upload.single('productImage'),ProductsController.products_create_product);

router.get('/:productId',ProductsController.products_get_product);

router.patch('/:productId',checkAuth,ProductsController.products_update_product);

router.delete('/:productId',ProductsController.products_delete_product);

router.get('/category/:productCategory',ProductsController.product_get_by_category);

router.get('/getSpecial/:status',ProductsController.product_get_special);

module.exports= router;