const express = require('express');


const {
    createCart,
    getUserCart
} = require('../controllers/cartController')
const {
    userAuth,
} = require('../middlewares/authMiddleware')


const router = express.Router();


// route to create a cart
router.post('/cart/:id',userAuth, createCart)  

// route to get a user's cart
router.get('/getCart/:id',userAuth, getUserCart)  



module.exports = router;