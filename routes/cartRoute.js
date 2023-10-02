const express = require('express');


const {
    createCart,
    getUserCart,
    updateCart,
    removeCartItem,
    deleteCart
} = require('../controllers/cartController')
const {
    userAuth,
} = require('../middlewares/authMiddleware')


const router = express.Router();


// route to create a cart
router.post('/cart/:id',userAuth, createCart)  

// route to get a user's cart
router.get('/getCart/:id',userAuth, getUserCart)  

// route to get a user's cart
router.put('/update/:id',userAuth, updateCart) 

// route to remove item from a cart
router.put('/remove/:id',userAuth, removeCartItem) 

// route to delete a cart
router.delete('/deletecart/:id',userAuth, deleteCart) 



module.exports = router;