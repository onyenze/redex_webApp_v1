const express = require('express');


const {
    createOrder
} = require('../controllers/orderController')
const {
    userAuth,
} = require('../middlewares/authMiddleware')


const router = express.Router();


// route to create an order
router.post('/order',userAuth, createOrder)



module.exports = router;

