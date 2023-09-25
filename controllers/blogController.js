const express = require('express');
const cloudinary = require("../utilities/cloudinary")
const blogModel = require('../models/blogModel'); // Assuming this is the path to your blog model



// Define a route for creating a new blog post with image uploads
const createBlogPost = async (req, res) => {
  try {
    const { title, body, category } = req.body;
    const images = req.files;
    
    // Upload images to Cloudinary
    const uploadedImages = await Promise.all(
      images.blogPictures.map((image) => cloudinary.uploader.upload(image.tempFilePath,{folder:"blogPictures"},
      (err, blogPictures) => {
        try {
          return blogPictures;
        } catch (err) {
          return err;
        }
      }
    ))
    );

    // Extract the public URLs of the uploaded images
    const imageUrls = uploadedImages.map((image) => image.secure_url);


    // Extract the public URLs of the uploaded images
    const publicIds = uploadedImages.map((image) => image.public_id);


    const newBlogPost = new blogModel({
      title,
      body,
      blogPictures: imageUrls, 
      publicIds: publicIds, 
      category,
    });

    // Save the new blog post to the database
    const savedBlogPost = await newBlogPost.save();

    res.status(201).json({ data:savedBlogPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message : error.message });
  }
}


const getAllPosts = async (req,res)=>{
    try {
        const allPosts = await blogModel.find()
        if(!allPosts){
            return res.status(404).json({message:"No posts found"})
        } else {
            return  res.status(200).json({
                data : allPosts
            })
        }

    } catch (error) {
        res.status(500).json({
            data:error.message
        })
    }
}

const getOnePost = async (req,res)=>{
    try {
        const ID = req.params.id
        const blogPost = await blogModel.findById(ID)
        if(!blogPost){
            return res.status(404).json({message:"No post found"})
        } else {
            return  res.status(200).json({
                data : blogPost
            })
        }

    } catch (error) {
        res.status(500).json({
            data:error.message
        })
    }
}

// Define a route for updating an existing blog post
const updateBlogPost = async (req, res) => {
    try {
      const postId = req.params.id; // Assuming you pass the post ID in the route URL
      const { title, body, category } = req.body;
      const images = req.files;
  
      // Check if the specified blog post exists
      const existingBlogPost = await blogModel.findById(postId);
  
      if (!existingBlogPost) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
  
      // Update the blog post fields if new values are provided
      if (title) {
        existingBlogPost.title = title;
      }
      if (body) {
        existingBlogPost.body = body;
      }
      if (category) {
        existingBlogPost.category = category;
      }

      // Handle image updates
      if (images.blogPictures && images.blogPictures.length > 0) {
        
        const uploadedImages = await Promise.all(
            images.blogPictures.map((image) => cloudinary.uploader.upload(image.tempFilePath,{folder:"blogPictures"},
            (err, blogPictures) => {
              try {
                return blogPictures;
              } catch (err) {
                return err;
              }
            }
          ))
        );
  
        // Extract the public URLs and public IDs of the uploaded images
        const newImageUrls = uploadedImages.map((image) => image.secure_url);
        const newPublicIds = uploadedImages.map((image) => image.public_id);
            
        console.log(newImageUrls);
        // Replace the existing image URLs and public IDs with the new ones
        existingBlogPost.blogPictures = newImageUrls;
        existingBlogPost.publicIds = newPublicIds;
      }
  
      // Save the updated blog post to the database
      const updatedBlogPost = await existingBlogPost.save();
  
      res.status(200).json({ data: updatedBlogPost });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };
  


// Define a route for deleting a blog post
const deleteBlogPost = async (req, res) => {
    try {
      const postId = req.params.id; // Assuming you pass the post ID in the route URL
  
      // Check if the specified blog post exists
      const existingBlogPost = await blogModel.findById(postId);
  
      if (!existingBlogPost) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
  
      // Retrieve the public IDs of the images associated with the blog post
      const publicIds = existingBlogPost.publicIds;
  
      // Delete the images from Cloudinary using their public IDs
      const deletionResults = await Promise.all(
        publicIds.map((publicId) =>
          cloudinary.uploader.destroy(publicId, { invalidate: true })
        )
      );
  
      // Check the deletion results (Cloudinary returns a response for each image deletion)
      const deletionErrors = deletionResults.filter((result) => result.result !== 'ok');
  
      if (deletionErrors.length > 0) {
        return res.status(500).json({ message: 'Failed to delete some images' });
      }
  
      // Delete the blog post document from your database
      await blogModel.findByIdAndDelete(postId)
  
      res.status(200).json({message : "Deleted successfully"}); // Respond with a 204 status (no content) for a successful deletion
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };

module.exports = {
    createBlogPost, 
    getAllPosts,
    getOnePost,
    updateBlogPost,
    deleteBlogPost
};
