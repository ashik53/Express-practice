const Order = require('../models/order')
const Product = require('../models/product')
const mongoose = require('mongoose');

exports.products_get_all = (req, res, next) => {

    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage: doc.productImage,
                        request: {
                            type: "GET",
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }

            res.status(200).json(response)

        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            })
        })


}

exports.products_store_product = (req, res, next) => {

    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })

    product.save().then(result => {
        console.log(result)
        res.status(201).json({
            message: 'Created product successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                productImage: result.productImage,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }

            }
        })
    }).catch(error => {
        console.log(error);
        res.status(500).json({
            error: error
        })
    })


}

exports.products_get_a_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost/products'
                    }
                });
            } else {
                res.status(404).json({ message: 'No valid entry found for the ID' })
            }
            res.status(200).json(doc);
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                error: error
            })
        })
}

exports.products_delete_a_product = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then((result) => {
            res.status(200).json({
                message: 'Product deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products',
                    body: { name: 'String', price: 'Number' }

                }
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            })
        })

}

exports.products_update_a_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    console.log(req.body);

    Product.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then((result) => {
            console.log(result);
            res.status(200).json({
                message: 'Product updated successfully',
               
                url: 'http://localhost/products/' + id
            })
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
}