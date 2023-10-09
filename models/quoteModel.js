const mongoose = require('mongoose');

const brandingRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    uploadedImage: {
        type: String, 
        required: true,
    },
    description: {
        type: String, 
    },
    status: {
        type: String,
        enum: ['Pending Review', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending Review',
        required: true,
    },
    selctedQuantity: {
        type: Number,
        required: true,
    },
    priceQuote: {
        type: Number, // Store the price quote for branding
        required: true,
    },
});

const brandingRequestModel = mongoose.model('BrandingRequest', brandingRequestSchema);

module.exports = brandingRequestModel;
