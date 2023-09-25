const express = require('express');


const {
    createBlogPost,
    getAllPosts,
    getOnePost,
    updateBlogPost,
    deleteBlogPost
} = require('../controllers/blogController')
const {
    userAuth,
} = require('../middlewares/authMiddleware')


const router = express.Router();


// Major Routes for Normal USERS

// route to create a blog post
router.post('/post', createBlogPost)  

// route to get all posts
router.get("/getposts",getAllPosts)

// Route to get One post
router.get("/getOnePost/:id",getOnePost)

// route to update blog post
router.put("/update-post/:id" ,updateBlogPost )

// route to delete blog post
router.delete("/delete/:id", deleteBlogPost)

module.exports = router;