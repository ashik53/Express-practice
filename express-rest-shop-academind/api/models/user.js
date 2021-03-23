const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    
    _id: mongoose.Schema.Types.ObjectId, 
    /*
        'unique' feature added indexing(performance optimization), no extra validation
        match resembles that validation of regex

    */
    email: {
        type: String, 
        required:true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    }, 
    password: {type: String, required:true } 
    

});

module.exports = mongoose.model('User', userSchema)