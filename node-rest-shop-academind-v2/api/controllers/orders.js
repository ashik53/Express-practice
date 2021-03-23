
const Order = require('../models/order')
const Product = require('../models/product')
const mongoose = require('mongoose');

exports.orders_get_all = (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product', 'name price _id') //populate will output the linked object data, second argument defines which property need to fetch
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map((docs) => {
                    return {
                        _id: docs._id,
                        product: docs.product,
                        quantity: docs.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + docs._id
                        }
                    }
                })
            })
        })
        .catch(error => {
            res.status(500).json({
                error: error
            })
        })
}

exports.orders_created_order = (req, res, next) => {

    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }

            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId

            });

            return order.save()

        })//then
        .then((result) => {
            res.status(201).json({
                message: 'Order stored',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            })

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })

}

exports.orders_get_order = (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate('product', 'name price')
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: "Order not found"
                })
            }
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders'
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })

}

exports.orders_delete_order = (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted',
                request: {
                    type: "POST",
                    url: "http://localhost:3000/orders",
                    body: {
                        productId: "ID",
                        quantity: "Number"
                    }
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })

}