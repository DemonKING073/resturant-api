const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type:String,required:true},
    price:{type:Number,required:true},
    productImage:{type:String,required:true},
    productDesc:{type:String, required:true },
    productCategory:{type:String,required:true},
    special:{type:Boolean}
});

module.exports= mongoose.model('Product',productSchema);