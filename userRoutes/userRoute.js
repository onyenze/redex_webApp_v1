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
    deleteUser,
    followUser,
    unfollowUser,
    getUserProfile,
    addProfilePicture,
    createAdmin,
    allAdminUsers,
    makeAdmin,
    makeSuperAdmin
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
router.put('/changepassword/:id', userAuth,changePassword) // checked
router.post('/changepassword/:id/:token',passwordMiddleware, resetPassword) // checked
router.post('/forgotpassword', forgotPassword) // checked
router.put(
    "/add-profile-image/:id",
    userAuth,
    addProfilePicture
  );    
router.put('/updateuser',  userAuth, validateUser,updateUsers) // checked

// Route to follow a User
router.put('/users/follow/:followId', userAuth,followUser);

// Route to unfollow a User
router.put('/users/unfollow/:unfollowId', userAuth,unfollowUser);

// GET request to get all event reviews
router.get('/getUserProfile/:id',getUserProfile);

// Major Routes for SUPER ADMIN routes

router.post('/createAdmin/:id', userAuth, isSuperAdminAuthorized, createAdmin);
router.get('/allAdminUsers/:id', userAuth, isSuperAdminAuthorized, allAdminUsers);
router.post('/:id/makeAdmin/:userId', userAuth, isSuperAdminAuthorized, makeAdmin);
router.post('/:id/makeSuperAdmin/:userId', userAuth, isSuperAdminAuthorized, makeSuperAdmin);



module.exports = router;

