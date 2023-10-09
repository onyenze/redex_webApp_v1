const cloudinary = require("../utilities/cloudinary")
const productModel = require('../models/inventoryModel');
const userModel = require('../models/userModel');
const brandingRequestModel = require('../models/quoteModel');


const createBrandingRequest = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        const product = await productModel.findById(req.params.id)
        if(!product){
            return res.status(404).json({message:"Product not found"})
        }

        const { description ,selectedQuantity} = req.body;


        let result = null;

          if (req.files) {
            result= await cloudinary.uploader.upload(
              req.files.uploadedImage.tempFilePath,{folder:"uploadedImage"},
              (err, uploadedImage) => {
                try {
                  return uploadedImage;
                } catch (err) {
                  return err;
                }
              }
            );
          } 

        
        percentageToIncrease = (selectedQuantity * product.productPrice)  *  37.5/100

        priceQuote = (selectedQuantity * product.productPrice) + percentageToIncrease
        

        // Create a branding request
        const brandingRequest = new brandingRequestModel({
            user: userId,
            product:req.params.id,
            uploadedImage:result.secure_url,
            description,
            selectedQuantity,
            priceQuote,
            status: 'Pending Review',
        });

        // Save the branding request to the database
        await brandingRequest.save();

        user.requestedQuotes.push(brandingRequest)

         await user.save()

        return res.status(201).json({ message: 'Branding request created successfully', data: brandingRequest });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOneBrandingRequest = async (req, res) => {
  try {
      const userId = req.userId;
      const requestId = req.params.id;
      
      // Find the branding request by ID while populating the 'product' field
      const brandingRequest = await brandingRequestModel.findById(requestId)
          .populate('product') // Populate the 'product' field
          .exec();

      if (!brandingRequest) {
          return res.status(404).json({ message: 'Branding request not found' });
      }

      // Check if the branding request belongs to the authenticated user
      if (brandingRequest.user.toString() !== userId) {
          return res.status(403).json({ message: 'Access denied. This branding request does not belong to you.' });
      }

      return res.status(200).json({ data: brandingRequest });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


const getAllUserBrandingRequests = async (req, res) => {
  try {
      const userId = req.userId;
      
      // Find all branding requests for the authenticated user while populating the 'product' field
      const brandingRequests = await brandingRequestModel.find({ user: userId })
          .populate('product') // Populate the 'product' field
          .exec();

      return res.status(200).json({ data: brandingRequests });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


module.exports = { createBrandingRequest, 
  getOneBrandingRequest,
  getAllUserBrandingRequests
}

