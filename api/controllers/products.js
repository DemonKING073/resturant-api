
const Product = require('../models/product');
const mongoose = require('mongoose');


exports.products_get_all = (req, res, next)=>{
    Product.find()
    .select('name special price _id productImage productDesc productCategory')
    .exec()
    .then(docs=>{
        const response={
            count:docs.length,
            products: docs.map(doc=>{
                productImage = doc.productImage;
                Length= productImage.length;
                mainNumber = 8;
                imageName =  productImage.slice(mainNumber,Length)
                return {
                    name:doc.name,
                    price:doc.price,
                    productDesc: doc.productDesc,
                    productImage: doc.productImage,
                    imageUrl:`http://localhost:3000/uploads/${imageName}`,
                    productCategory:doc.productCategory,
                    special:doc.special,
                    _id:doc._id,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/products/'+doc._id
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
}

exports.products_create_product = (req, res, next)=>{
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage:req.file.path,
        productDesc: req.body.productDesc,
        productCategory: req.body.productCategory,
        special:req.body.special,
    });
    product
    .save()
    .then(result=>{
        console.log(result);
        res.status(201).json({
            message:'Created Product Successfully!',
            createdProduct: {
                name:result.name,
                price:result.price,
                productDesc: result.productDesc,
                productCategory: result.productCategory,
                special:result.special,
                _id:result._id,
                request:{
                    type:'GET',
                    url:'http://localhost:3000/products/'+result._id
                }
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    });
}

exports.products_get_product = (req, res, next)=>{
    const id=req.params.productId;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc=>{
        console.log('From Database',doc);
        if(doc){
            res.status(200).json({
                product:doc,
                request:{
                    type:'GET',
                    description:'GET_ALL_PRODUCTS',
                    url:'http://localhost:3000/products'
                }
            });
        }
        else{
            res.status(404).json({
                message:'No valid entry found for provided Id'
            })
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
}

exports.products_update_product = (req, res, next)=>{
    const id = req.params.productId;
    const updateOps={};
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
    Product.updateOne({_id:id},{$set:updateOps})
    .exec()
    .then(result=>{
        res.status(200).json({
            message:'Product Updated!',
            request:{
                type: 'GET',
                url:'http://localhost:3000/products/'+id
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
}

exports.products_delete_product = (req, res, next)=>{
    const id = req.params.productId;
    Product.deleteOne({_id:id})
    .exec()
    .then(result=>{
        res.status(200).json({
            message:'Product Deleted!',
            request:{
                type:'POST',
                url:'http://localhost:3000/products',
                body:{name:'String', price:'Number'}
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.product_get_by_category = async (req, res, next) => {
    try { 
        const products = await Product.find({productCategory:req.params.productCategory})
        res.status(200).json({
            Products:products
        });
    }
    catch(err) {
        res.status(500).json({
            error:err
        });
    }      
}

exports.product_get_special = (req, res, next) =>{
    Product.find({special:req.params.status})
        .exec()
        .then(products=>{
            res.status(200).json({
                specialProducts:products
            });
        })
        .catch(err=>{
            res.status(500).json({
                error:err
            });
        });
}