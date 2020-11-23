const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email:{type:String},
    userName:{type:String},
    totalPrice:{type:String},
    products:{type:Array},
    date:{type:Date}
    
});

module.exports= mongoose.model('Order',orderSchema);