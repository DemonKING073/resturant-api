const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user')

exports.top_customer = (req, res, next)=>{
    Order.find()
        .exec()
        .then(orders=>{
            let total = 0;
            let topCustomer='' ;
            orders.map(item=>{
                if(total<Number(item.totalPrice)){
                    total=item.totalPrice
                    topCustomer=item.userName
                }
            });
            User.find({name:topCustomer})
                .exec()
                .then(result=>{
                    res.status(200).json({
                        topCustomer:result[0]
                    });
                })
                .catch(err=>{
                    res.status(500).json({
                        error:err
                    });
                });
            
        })
        .catch(err=>{
            res.status(500).json({
                error:err
            });
        });
}

exports.order_sales = (req, res, next) =>{
    Order.find()
    .populate('product','name')
    .select('products date email userName _id totalPrice ')
    .exec()
    .then(docs=>{
        let total = 0;
        docs.map(item=>{
            total = total + Number(item.totalPrice)
        })
        res.status(200).json({
            totalSales: total
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        });
    });
}

exports.orders_full = (req,res, next)=>{
    Order.find()
    .populate('product','name')
    .select('products date email userName _id totalPrice ')
    .exec()
    .then(docs=>{
        res.status(200).json({
            count: docs.length,
            orders:docs.map(doc=>{
                return{
                    _id: doc._id,
                    products:doc.products,
                    total:doc.totalPrice,
                    email: doc.email,
                    userName:doc.userName, 
                    date:doc.date         
                }
            }), 
        });
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        });
    });
}
exports.orders_get_all = (req, res, next)=>{
    Order.find({email:req.params.email})
    .populate('product','name')
    .select('products email userName _id totalPrice ')
    .exec()
    .then(docs=>{
        res.status(200).json({
            count: docs.length,
            orders:docs.map(doc=>{
                return{
                    _id: doc._id,
                    products:doc.products,
                    total:doc.totalPrice,
                    email: doc.email,
                    userName:doc.userName,          
                }
            }), 
        });
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        });
    });
}

exports.orders_create_order = (req, res, next)=>{
    const now = new Date();
    const order = new Order({
        _id: new mongoose.Types.ObjectId,
        email: req.body.email,
        userName:req.body.userName,
        totalPrice:req.body.totalPrice,
        products:req.body.products,
        date: now,
    });
    order
        .save()
        .then(result=>{
            console.log(result);
            res.status(201).json({
                message:'Order placed Successfully!'
            });
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
}

exports.orders_get_order = (req, res, next)=>{
    // Order.findById(req.params.orderId)
    // .populate('product','')
    // .exec()
    // .then(order=>{
    //     if(!order){
    //         return res.status(404).json({
    //             message:'Order Not Found!'
    //         })
    //     }
    //     res.status(200).json({
    //         order:order,
    //         request:{
    //             type:'GET',
    //             url:'http://localhost:3000/orders'
    //         }
    //     });
    // })
    // .catch(err=>{
    //     res.status(500).json({
    //         error:err
    //     }); 
    // });
}

exports.orders_delete_order = (req, res, next)=>{
    Order.remove({_id:req.params.orderId})
    .exec()
    .then(result=>{
        res.status(200).json({
            message:'Order Deleted',
            request:{
                type:'POST',
                url:'http://localhost:3000/orders',
                body:{productId:'ID', quantity:'Number'}
            }
        });
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        }); 
    });
}