/*
    app.js makes easier the request handling
*/

const express= require('express');
const bodyParser = require('body-parser');
const app = express();
const morgan = require('morgan'); // for logging the requests on console

const mongoose = require('mongoose'); //mongoose package
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders')
const userRoutes = require('./api/routes/user');

const url = 'mongodb+srv://express-shop:uH9Z8qQeChpC2Fz7@node-express-shop-acade.hf4nm.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(url, {
    useNewUrlParser :true,
    useUnifiedTopology: true
}).then(()=> {
    console.log("mongodb connected")
}).catch((err) => {
    console.log("connection error " + err)
})

mongoose.Promise = global.Promise; //[To do] read about this later, if you don't use this line then it will throw an error

/* actually what happens there
   all requests passes all of the below middlewares
   firstly they have to pass morgran middleware, then the routes
*/

/* app.use is a middleware */
app.use(morgan('dev')); // use this middleware before all routes 
/* 
    /uploads will be the added before requesting an image
*/
app.use('/uploads', express.static('uploads')) //upload folder available to get an image, paste on url http://localhost:8080/uploads/file_name
//extended:true means it will support rich data
//app.use(bodyParser.urlencoded({extended: false})); 
app.use(express.json())
//app.use(bodyParser.json());

app.use((req, res, next) => {
    /* * means for all sites, you can specify a website like 'http://my-cool-page.com' 
        access-control-allow-origin 
    */
    //first for Origin
    res.header('Access-Control-Allow-Origin', '*');
    //send client to list of allowed headers * for anything
    //this for Headers
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    
    //this for request methods [questions:search about this how it works]
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({})
        
    }
    next();
})


app.use('/products', productRoutes);
app.use('/orders', orderRoutes)
app.use('/user',userRoutes);

//when you get any wrong route
app.use((req, res, next) => {
    const error = new Error('Not found'); //error object making
    error.status = 404 // not found error is 404 types
    next(error) // pass the error to the next middleware
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error:{
            message: error.message
        }
    })
});

module.exports = app