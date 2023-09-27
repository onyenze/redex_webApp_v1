const express = require('express');
const cloudinary = require("../utilities/cloudinary")
const productModel = require('../models/inventoryModel'); 



// Define a route for creating a new product with image uploads
const createProduct = async (req, res) => {
  try {
    const { productName, productDescription, productType,productSize,productPrice,productQuantity } = req.body;
    const images = req.files;
    
    // Upload images to Cloudinary
    const uploadedImages = await Promise.all(
      images.productImages.map((image) => cloudinary.uploader.upload(image.tempFilePath,{folder:"productImages"},
      (err, productImages) => {
        try {
          return productImages;
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


    const newProduct = new productModel({
    productName,
    productDescription,
      productImages: imageUrls, 
      publicIds: publicIds, 
      productType,
      productSize,
      productPrice,
      productQuantity
    });

    // Save the new product to the database
    const savedProduct = await newProduct.save();

    res.status(201).json({ data:savedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message : error.message });
  }
}


const getAllProducts = async (req,res)=>{
    try {
        const allProducts = await productModel.find()
        if(!allProducts){
            return res.status(404).json({message:"No posts found"})
        } else {
            return  res.status(200).json({
                data : allProducts
            })
        }

    } catch (error) {
        res.status(500).json({
            data:error.message
        })
    }
}

const getOneProduct = async (req,res)=>{
    try {
        const ID = req.params.id
        const product = await productModel.findById(ID)
        if(!product){
            return res.status(404).json({message:"No post found"})
        } else {
            return  res.status(200).json({
                data : product
            })
        }

    } catch (error) {
        res.status(500).json({
            data:error.message
        })
    }
}

// Define a route for updating an existing product
const updatedProduct = async (req, res) => {
    try {
      const productId = req.params.id; // Assuming you pass the post ID in the route URL
      const { productName, productDescription, productType,productSize,productPrice,productQuantity } = req.body;
      const images = req.files;
  
      // Check if the specified product exists
      const existingProduct = await productModel.findById(productId);
  
      if (!existingProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Update the products fields if new values are provided
      if (productName) {
        existingProduct.productName = productName;
      }
      if (productDescription) {
        existingProduct.productDescription = productDescription;
      }
      if (productType) {
        existingProduct.productType = productType;
      }
      if (productSize) {
        existingProduct.productSize = productSize;
      }
      if (productPrice) {
        existingProduct.productPrice = productPrice;
      }
      if (productQuantity) {
        existingProduct.productQuantity = productQuantity;
      }

      // Handle image updates
      if (images.productImages && images.productImages.length > 0) {
        
        const uploadedImages = await Promise.all(
            images.productImages.map((image) => cloudinary.uploader.upload(image.tempFilePath,{folder:"productImages"},
            (err, productImages) => {
              try {
                return productImages;
              } catch (err) {
                return err;
              }
            }
          ))
        );
  
        // Extract the public URLs and public IDs of the uploaded images
        const newImageUrls = uploadedImages.map((image) => image.secure_url);
        const newPublicIds = uploadedImages.map((image) => image.public_id);
            
        // Replace the existing image URLs and public IDs with the new ones
        existingProduct.productImages = newImageUrls;
        existingProduct.publicIds = newPublicIds;
      }
  
      // Save the updated product to the database
      const updatedProduct = await existingProduct.save();
  
      res.status(200).json({ data: updatedProduct });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };
  


// Define a route for deleting a product
const deleteProduct = async (req, res) => {
    try {
      const productId = req.params.id; // Assuming you pass the post ID in the route URL
  
      // Check if the specified product exists
      const existingProduct = await productModel.findById(productId);
  
      if (!existingProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Retrieve the public IDs of the images associated with the product
      const publicIds = existingProduct.publicIds;
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
  
      // Delete the product document from your database
      await productModel.findByIdAndDelete(productId)
  
      res.status(200).json({message : "Deleted successfully"}); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };

module.exports = {
    createProduct, 
    getAllProducts,
    getOneProduct,
    updatedProduct,
    deleteProduct
};
