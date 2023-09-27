const express = require('express');


const {
    createProduct, 
    getAllProducts,
    getOneProduct,
    updatedProduct,
    deleteProduct
} = require('../controllers/inventoryController')
const {
    userAuth,
} = require('../middlewares/authMiddleware')


const router = express.Router();


// Major Routes for Normal USERS

// route to create a product
router.post('/product', createProduct)  

// route to get all products
router.get("/getProducts",getAllProducts)

// Route to get One product
router.get("/product/:id",getOneProduct)

// route to update product
router.put("/update-product/:id" ,updatedProduct )

// route to delete product
router.delete("/delete-product/:id", deleteProduct)

module.exports = router;