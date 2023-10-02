const express = require('express');


const {
    createOrder,
    getAllUserOrders,
    getOneUserOrder
} = require('../controllers/orderController')
const {
    userAuth,
} = require('../middlewares/authMiddleware')


const router = express.Router();


// route to create an order
router.post('/order',userAuth, createOrder)

// route to get all of a user's order
router.get('/orders',userAuth, getAllUserOrders)

// route to get one of a user's order
router.get('/oneorder',userAuth, getOneUserOrder)



module.exports = router;

