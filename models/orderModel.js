const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', 
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
    }],
    totalQuantity: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending',
        required: true,
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    deliveryAddress: {
        street: String,
        city: String,
        postalCode: String,
    },
});

const orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;
