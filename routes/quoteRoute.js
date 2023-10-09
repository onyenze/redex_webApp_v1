const express = require('express');
const router = express.Router();
const {createBrandingRequest} = require("../controllers/quoteController")
const { userAuth } = require('../middlewares/authMiddleware');

// Create a branding request
router.post('/branding-request/:id', userAuth, createBrandingRequest);

// Add more routes to retrieve branding requests as needed

module.exports = router;
