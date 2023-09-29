const express = require('express');


const {
    createCart
} = require('../controllers/cartController')
const {
    userAuth,
} = require('../middlewares/authMiddleware')


const router = express.Router();


// route to create a cart
router.post('/cart/:id',userAuth, createCart)  



module.exports = router;