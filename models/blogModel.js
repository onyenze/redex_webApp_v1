const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is Required']
    },
    body: {
        type: String,
        required: [true, 'body is Required']
    },
    blogPictures: [{
        type: String,
        required: [true, 'Picture is Required']
    }],
    publicIds: [{
        type: String
    }],
    category: {
        type: String,
    },
}, {timestamps: true});

const blogModel = mongoose.model('Blog', blogSchema);
module.exports = blogModel