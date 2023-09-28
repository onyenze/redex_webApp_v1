const cartModel = require('../models/cartModel');

// Assuming you have a user's ID and the product details
const userId = 'user123'; // Replace with the actual user ID
const product = {
    _id: 'product456', // Replace with the actual product ID
    price: 10, // Replace with the actual product price
    // Other product details
};
const quantity = 3; // The quantity the user wants to add to the cart

// Find the user's cart or create one if it doesn't exist
const cart = await Cart.findOne({ user: userId }).exec();
if (!cart) {
    const newCart = new Cart({ user: userId, items: [] });
    await newCart.save();
}

// Add the product to the cart
const cartItem = {
    product: product._id,
    quantity: quantity,
    price: product.price,
    totalPrice: quantity * product.price,
};

cart.items.push(cartItem);
cart.totalQuantity += quantity;
cart.totalPrice += cartItem.totalPrice;

await cart.save();
