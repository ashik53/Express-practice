
/*
    orders are connected to products
*/

const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    
    _id: mongoose.Schema.Types.ObjectId, // 
    quantity: {type: Number, default: 1}, // if you don't give a value, it will save 1, so required is not needed here
    //add relation with product & order
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true}, // It comens frpm Product , it is required
    

});

//takes two argument schema name(Starting uppercase,it's a convention), schema model
module.exports = mongoose.model('Order', orderSchema)