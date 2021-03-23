
const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, // 
    name: {type: String, required: true}, //add mongoose validation
    price: {type: Number, required: true}, //add mongoose validation
    //productImage: { type: String, required: true}
})

//takes two argument schema name(Starting uppercase,it's a convention), schema model
module.exports = mongoose.model('Product', productSchema)