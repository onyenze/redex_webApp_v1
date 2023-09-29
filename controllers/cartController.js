const cartModel = require('../models/cartModel');
const productModel = require('../models/inventoryModel');

const createCart = async (req,res)=>{
    try {
        // Assuming you have a user's ID and the product details
const userId = req.userId; // Replace with the actual user ID
// const email = 
const productId = req.params.id
const product = await productModel.findById(productId)
    if(!product){
        return res.status(404).send('Product not found')
    }
const quantity = 1; // The default quantity is One

const cartItem = {
    product: product._id.toString(),
    quantity: quantity,
    price: product.productPrice,
    totalPrice: quantity * product.productPrice,
};

// Find the user's cart or create one if it doesn't exist
const cart = await cartModel.findOne({ user: userId }).exec();

if (!cart) {
    const newCart = new cartModel({ user: userId, items: [] });
    // Add the product to the cart

newCart.items.push(cartItem);
newCart.totalQuantity += quantity;
newCart.totalPrice += cartItem.totalPrice;
    await newCart.save();
    res.status(201).json({data:newCart})
}


else {
    
cart.items.push(cartItem);
cart.totalQuantity += quantity;
cart.totalPrice += cartItem.totalPrice;

await cart.save();

res.status(201).json({data:cart})
}

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}


module.exports = {
    createCart
}