const cartModel = require('../models/cartModel');
const userModel = require('../models/userModel');
const orderModel = require("../models/orderModel")

const createOrder = async (req, res) => {
    try {
        const userId = req.userId; 
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user has a cart
        if (!user.cart) {
            return res.status(400).json({ message: 'User does not have a cart. Add items to the cart first.' });
        }

        // Retrieve the user's cart and associated items
        const cart = await cartModel.findById(user.cart);

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Create an order from the cart
        const orderItems = cart.items.map((cartItem) => ({
            product: cartItem.product,
            quantity: cartItem.quantity,
            price: cartItem.price,
            totalPrice: cartItem.totalPrice,
        }));

        const totalQuantity = cart.totalQuantity;
        const totalPrice = cart.totalPrice;

        // You can add more details to the order, such as delivery address and payment information
        const order = new orderModel({
            user: userId,
            items: orderItems,
            totalQuantity,
            totalPrice,
            status: 'Pending', // You can set the initial status as 'Pending'
            // Add more order details here, e.g., deliveryAddress, paymentInfo, etc.
        });

        // Save the order to the database
        await order.save();
        
        user.orders.push(order)
        console.log(user.orders);
        await user.save()
        // Clear the user's cart as the items have been ordered
        await cartModel.findByIdAndDelete(cart._id)

        // You can implement additional logic for handling payments and other order-related actions here.

        return res.status(201).json({ message: 'Order created successfully', data: order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getAllUserOrders = async (req, res) => {
    try {
        const userId = req.userId; // Assuming you have a middleware that provides the authenticated user's ID
        const user = await userModel.findById(userId)
            .populate('orders') // Populate the 'orders' field to get the actual order documents
            .exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log(user);
        const userOrders = user.orders;

        return res.status(200).json({ data: userOrders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getOneUserOrder = async (req, res) => {
    try {
        const userId = req.userId; 
        const orderId = req.params.id; 

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user has the specified order
        const orderExists = user.orders.includes(orderId);

        if (!orderExists) {
            return res.status(404).json({ message: 'Order not found for this user' });
        }

        // Retrieve the order by its ID
        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json({ data: order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createOrder,
    getAllUserOrders,
    getOneUserOrder
}
