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

        const { description ,selctedQuantity} = req.body;


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

        
        percentageToIncrease = (selctedQuantity * product.productPrice)  *  37.5/100

        priceQuote = (selctedQuantity * product.productPrice) + percentageToIncrease
        

        // Create a branding request
        const brandingRequest = new brandingRequestModel({
            user: userId,
            product:req.params.id,
            uploadedImage:result.secure_url,
            description,
            selctedQuantity,
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

module.exports = { createBrandingRequest}

