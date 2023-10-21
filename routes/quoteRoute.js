const express = require('express');
const router = express.Router();
const { createBrandingRequest, 
    getOneBrandingRequest,
    getAllUserBrandingRequests
  } = require("../controllers/quoteController")
const { userAuth } = require('../middlewares/authMiddleware');

// Create a branding request
router.post('/branding-request/:id', userAuth, createBrandingRequest);




// Get one branding request
router.get('/branding-requests/:id', userAuth, getOneBrandingRequest);

// Get all of a user's branding requests
router.get('/branding-requests', userAuth, getAllUserBrandingRequests);

module.exports = router;
