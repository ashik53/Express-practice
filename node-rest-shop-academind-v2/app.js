const express = require('express');
const app = express(); // this will run express application

const morgan = require('morgan')
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

//password will be database user password
mongoose.connect('mongodb+srv://express-shop:'+ process.env.MONGO_ATLAS_PW +'@node-restapi-academind.hf4nm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology:true
}).then(() => {
    console.log("mongodb connected")
}).catch((error) => {
    console.log("connection error " +error)
})

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');
/* app.use is a middleware, all requests must pass through it */
app.use(morgan('dev')); //developer version of logging

/* body parser extracts urlencoded & json data so that 

*/
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//allowing cors should be before routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Orgin, X-Requested-With, Content-Type, Accept, Authorization');

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, PATCH, GET');
        return res.status(200).json({})
    }

    next();
})

app.use('/products', productRoutes); 
app.use('/orders', orderRoutes);
app.use("/user", userRoutes);
//when don't get any route
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app