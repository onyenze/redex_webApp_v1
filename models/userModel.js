const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'FirstName is Required']
    },
    lastname: {
        type: String,
        required: [true, 'LastName is Required']
    },
    phoneNumber: {
        type: Number,
        required: [true, 'LastName is Required']
    },
    email: {
        type: String,
        required: [true, 'Email is Required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is Required'],
        // select:false
    },
    token: {
        type: String,
        select:false
    },
    profilePicture:{
        type:String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    islogin: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
}, {timestamps: true});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel