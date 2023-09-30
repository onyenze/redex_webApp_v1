const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, 'productName is Required']
    },
    productDescription: {
        type: String,
        required: [true, 'productDescription is Required']
    },
    topDemanding:{
        type: Boolean,
        default: false
    },
    productType: {
        type: String,
        required: [true, 'productType is Required']
    },
    productSize: {
        type: String,
        required: [true, 'productSize is Required'],
    },
    productPrice: {
        type: Number,
        required: [true, 'productPrice is Required'],
    },
    productQuantity: {
        type: Number,
        required: [true, 'productQuantity is Required']
    },
    productImages: [{
        type: String,
        required: [true, 'Picture is Required']
    }],
    publicIds: [{
        type: String
    }],
    isSoldOut: {
        type: Boolean,
        default: false
    },
}, {timestamps: true});

const productModel = mongoose.model('Product', productSchema);
module.exports = productModel