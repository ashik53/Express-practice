const express = require('express');

const router = express.Router();
const ProductController = require('../controllers/product')


const multer = require('multer');

const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
})

const fileFilter = (req, file, cb) => { //|| file.mimetype === 'image/png'
    //reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/', ProductController.products_get_all)


router.post('/', checkAuth, upload.single('productImage'), ProductController.products_store_product)
 
//get route to fetch all routes
router.get('/:productId', checkAuth,ProductController.products_get_a_product)

/* request model looks like
    [
    {
        "propName": "price", "value": 12
    }
]

*/

router.patch('/:productId', checkAuth, ProductController.products_update_a_product)

router.delete('/:productId', checkAuth, ProductController.products_delete_a_product)

module.exports = router