const cartModel = require('../models/cartModel');
const productModel = require('../models/inventoryModel');
const userModel = require('../models/userModel');

const createCart = async (req,res)=>{
    try {
        
    const userId = req.userId; 
    const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).send('User not found')
        }
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
    user.cart = newCart
    await newCart.save();
    await user.save()
    res.status(201).json({data:newCart})
}


else {
    const updateItem = cart.items.findIndex((product)=>product.toString())
    if (updateItem){
        cart.items[updateItem].quantity += 1
        cart.items[updateItem].totalPrice =  quantity * product.productPrice
        
        cart.totalQuantity += 1;
        cart.totalPrice += cart.items[updateItem].totalPrice;
        user.cart = cart
        // await cart.save();
        // await user.save()

    }
    cart.items.push(cartItem);
    cart.totalQuantity += quantity;
    cart.totalPrice += cartItem.totalPrice;
    user.cart = cart
    await cart.save();
    await user.save()


    res.status(201).json({data:cart})
}

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const getUserCart = async (req,res) => {
    try {
       const cartId = req.params.id
       const cart = await cartModel.findById(cartId)
       .populate({
        path: 'items.product', // Populate the "product" field in each cartItem
        model: 'Product', // Reference to the Product model
    })
    .populate({
        path: 'user', // Populate the "user" field in the cart
        model: 'User', // Reference to the User model
    })
    .exec();
       if(!cart){
        return res.status(404).json({message:"Cart not found"})
       }
       return  res.status(200).json({data : cart});
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const updateCart = async (req,res) => {
    try {
        const {productId, quantity} = req.body
        const product = await productModel.findById(productId)
        if(!product){
            return res.status(404).json({message:"product not found"})
        }
        const userId = req.userId
        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const cartId = req.params.id
        const cart = await cartModel.findById(cartId)
        if(!cart){
            return res.status(404).json({message:"Cart not found"})
        }
        
        const updateItem = cart.items.findIndex((product)=>product.toString())
        console.log(updateItem);
        console.log(cart.items[updateItem]);

        cart.items[updateItem].quantity = quantity
        cart.items[updateItem].totalPrice =  quantity * product.productPrice
        
        cart.totalQuantity += quantity;
        cart.totalPrice += cart.items[updateItem].totalPrice;
        user.cart = cart
        // await cart.save();
        // await user.save()


res.status(200).json({data:cart})

    } catch (error) {
       res.status(500).json({message:error.message}) 
    }
}

module.exports = {
    createCart,
    getUserCart,
    updateCart
}