const cartModel = require('../models/cartModel');
const productModel = require('../models/inventoryModel');
const userModel = require('../models/userModel');

const createCart = async (req, res) => {
    try {
        const userId = req.userId; 
        const productId = req.params.id;
        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const quantity = 1; // The default quantity is one

        const cartItem = {
            product: product._id.toString(),
            quantity: quantity,
            price: product.productPrice,
            totalPrice: quantity * product.productPrice,
        };

        // Check if the user is authenticated
        if (userId) {
            const user = await userModel.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Find the user's cart or create one if it doesn't exist
            const cart = await cartModel.findOne({ user: userId }).exec();

            if (!cart) {
                const newCart = new cartModel({ user: userId, items: [] });

                // Add the product to the cart
                newCart.items.push(cartItem);
                newCart.totalQuantity += quantity;
                newCart.totalPrice += cartItem.totalPrice;

                user.cart = newCart;
                await newCart.save();
                await user.save();

                return res.status(201).json({ message: 'Cart created', data: newCart });
            } else {
                // Check if the product is already in the cart
                const updateItemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

                if (updateItemIndex !== -1) {
                    cart.items[updateItemIndex].quantity += 1;
                    cart.items[updateItemIndex].totalPrice = cart.items[updateItemIndex].quantity * product.productPrice;

                    cart.totalQuantity += 1;
                    cart.totalPrice += 1 * product.productPrice;

                    user.cart = cart;
                    await cart.save();
                    await user.save();

                    return res.status(200).json({ message: 'Product quantity updated', data: cart });
                } else {
                    cart.items.push(cartItem);
                    cart.totalQuantity += quantity;
                    cart.totalPrice += cartItem.totalPrice;

                    user.cart = cart;
                    await cart.save();
                    await user.save();

                    return res.status(201).json({ message: 'Product added to cart', data: cart });
                }
            }
        } else {
            // Handle unauthenticated user's cart creation differently (e.g., using cookies or local storage)
            // Here, you can implement logic to create and manage carts for unauthenticated users
            // and return an appropriate response to them.
            // For example, you can create a temporary cart for unauthenticated users.
            // Ensure to implement cart management securely.
            // For simplicity, you can respond with a 201 status code and a message.
            return res.status(201).json({ message: 'Temporary cart created for unauthenticated user' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const getUserCart = async (req,res) => {
    try {
       const cartId = req.params.id
       const cart = await cartModel.findById(cartId)
       .populate({
        path: 'items.product', // Populate the "product" field in each cartItem
        model: 'Product', // Reference to the Product model
    })
    .populate({
        path: 'user', // Populate the "user" field in the cart
        model: 'User', // Reference to the User model
    })
    .exec();
       if(!cart){
        return res.status(404).json({message:"Cart not found"})
       }
       return  res.status(200).json({data : cart});
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const updateCart = async (req,res) => {
    try {
        const {productId, quantity} = req.body
        const product = await productModel.findById(productId)
        if(!product){
            return res.status(404).json({message:"product not found"})
        }
        const userId = req.userId
        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const cartId = req.params.id
        const cart = await cartModel.findById(cartId)
        if(!cart){
            return res.status(404).json({message:"Cart not found"})
        }
        
        const updateItem = cart.items.findIndex((item) => item.product.toString() === productId)
        cart.items[updateItem].quantity = quantity
        cart.items[updateItem].totalPrice =  quantity * product.productPrice

        
        cart.totalQuantity = cart.items.reduce((acc, item) => acc + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);
        user.cart = cart
        await cart.save();
        await user.save()


res.status(200).json({data:cart})

    } catch (error) {
       res.status(500).json({message:error.message}) 
    }
}

const removeCartItem = async (req, res) => {
    try {
        const {productId} = req.body; 
        const userId = req.userId;

        // Find the user's cart
        const cart = await cartModel.findById(req.params.id);

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the index of the item to remove
        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in the cart' });
        }

        // Get the removed item's quantity and price
        const removedItem = cart.items[itemIndex];
        const removedQuantity = removedItem.quantity;
        const removedTotalPrice = removedItem.totalPrice;

        // Remove the item from the cart
        cart.items.splice(itemIndex, 1);

        // Update total quantity and total price
        cart.totalQuantity -= removedQuantity;
        cart.totalPrice -= removedTotalPrice;

        // Update the user's cart
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.cart = cart;
        await cart.save();
        await user.save();

        return res.status(200).json({ message: 'Item removed from the cart', data: cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const deleteCart = async (req, res) => {
    try {
        const userId = req.userId;

        // Find the user's cart
        const cart = await cartModel.findById(req.params.id);

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        await cartModel.findByIdAndDelete(req.params.id)
        // Remove the cart reference from the user
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.cart = null; // Remove the reference to the cart
        await user.save();

        return res.status(200).json({ message: 'Cart deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createCart,
    getUserCart,
    updateCart,
    removeCartItem,
    deleteCart
}