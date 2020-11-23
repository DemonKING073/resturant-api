const express=require('express');
const router=express.Router();
const checkAuth = require('../middleware/check-auth');


const OrdersController = require('../controllers/orders');

router.get('/',OrdersController.orders_full);

router.get('/:email', OrdersController.orders_get_all);

router.post('/', OrdersController.orders_create_order);

router.get('/:orderId',checkAuth,OrdersController.orders_get_order);

router.delete('/:orderId',OrdersController.orders_delete_order);

router.get('/lamo/sales',OrdersController.order_sales);

router.get('/lamo/topcustomer',OrdersController.top_customer);

module.exports= router;