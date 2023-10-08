const {
    registration,
    verifyEmail,
    resendEmailVerification,
    logIn,
    signOut,
    changePassword,
    forgotPassword,
    resetPassword,
    updateUsers,
    addProfilePicture,
    createAdmin,
    allAdminUsers,
    allUsers
} = require('../controllers/userController')
const {
    userAuth,
    isAdminAuthorized,
    isSuperAdminAuthorized,
} = require('../middlewares/authMiddleware')
const { validationMiddleware } = require("../middlewares/validator");
const { validateUser } = require("../middlewares/updateUservalidator");
const { passwordMiddleware } = require("../middlewares/passwordValidator");

const express = require('express');
const router = express.Router();
// const upload = require("../utilities/multer");


// Major Routes for Normal USERS
router.post('/signup',validationMiddleware, registration)  // checked
router.put('/verify/:token', verifyEmail) // checked
router.put('/re-verify', resendEmailVerification) // checked
router.post('/login', logIn) //checked
router.put('/logout/:id',  userAuth, signOut) // checked
router.put('/changepassword', userAuth,changePassword) // checked
router.post('/changepassword/:id/:token',passwordMiddleware, resetPassword) // checked
router.post('/forgotpassword', forgotPassword) // checked
router.put(
    "/add-profile-image",
    userAuth,
    addProfilePicture
  );    
router.put('/updateuser',  userAuth, validateUser,updateUsers) // checked


// remember to add userAuth and isAdmin middleware
router.get('/allusers', allUsers)



module.exports = router;

