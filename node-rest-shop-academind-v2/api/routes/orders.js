const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth')



const OrderController = require('../controllers/orders');
router.get('/', checkAuth, OrderController.orders_get_all)

router.post('/', checkAuth, OrderController.orders_created_order);

router.get('/:orderId', checkAuth, OrderController.orders_get_order)

router.patch('/:orderId', checkAuth, (req, res, next) => {
    res.status(200).json({
      message: 'Order updated',
      orderId: req.params.orderId      
    })
})

router.delete('/:orderId', checkAuth, OrderController.orders_delete_order)

module.exports = router