const mongoose = require('mongoose');


/* 
   this is the structure of Alien info , 
   here every alien is a document, all documents make a collection
   That means table = collection , entity = document 
*/
const alienSchema = new mongoose.Schema({

    name: {
        type:String,
        required: true
    },
    tech: {
        type:String,
        required: true
    },
    sub: {
        type: Boolean,
        required: true,
        default: false
    }

})

module.exports = mongoose.model('Alien', alienSchema);