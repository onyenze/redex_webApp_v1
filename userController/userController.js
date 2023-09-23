require('dotenv').config();
const mongoose = require('mongoose');
const _ = require('lodash');
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require("../utilities/cloudinary")
const {sendEmail} = require('../middlewares/email')
const {generateDynamicEmail} = require("../utilities/sendingmail/verifymail")
const {generatePasswordEmail} = require("../utilities/sendingmail/changepassword")
// FUNCTIONALITIES FOR USER ALONE
// REGISTER USER 
const registration = async (req, res)=>{
    try {
        const { firstname,lastname, username,email, password,DOB } = req.body;
        const isEmail = await userModel.findOne({email});
        if (isEmail) {
            res.status(400).json({
                message: `User with this Email: ${email} already exist.`
            })
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash( password, salt )
            
            const data = {
                firstname,
                lastname,
                DOB,
                username,
                email: email.toLowerCase(),
                password: hashPassword
            };
            const user = new userModel(data);
            // const usertoken = await jwt.sign({user}, process.env.JWT_SECRET, {expiresIn: '1d'});
            // user.token = usertoken
            const savedUser = await user.save();
            const LinkToken = await jwt.sign({user}, process.env.JWT_SECRET, {expiresIn: "30m"});
            const subject = 'Kindly Verify'
            const link = `https://creativentstca.onrender.com/#/api/verify?token=${LinkToken}`
            //  const oglink = `https://creativents.onrender.com/verify/${savedUser._id}/${LinkToken}`
            // const oldlink = `${req.protocol}://${req.get('host')}/api/verify/${savedUser._id}/${LinkToken}`
            const message = `Welcome on board Creativents, kindly use this link ${link} to verify your account. Kindly note that this link will expire after 30 Minutes.`

            html = generateDynamicEmail(link, user.firstname)
            sendEmail({
                email: savedUser.email,
                subject,
                html
            });
            if (!savedUser) {
                res.status(400).json({
                    message: 'Failed to Create Account'
                })
            } else {
                res.status(201).json({
                    message: 'Successfully created account',
                    data: savedUser,
                    expireLink:LinkToken
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}; 




const verifyEmail = async (req, res) => {
    try {
      const { token } = req.params;
  
      // Verify the token and decode its payload
      const decodedToken = jwt.decode(token, process.env.JWT_SECRET);
        // console.log(decodedToken);
        console.log(decodedToken.user._id);
      if (!decodedToken || !decodedToken.user._id) {
        return res.json('Invalid token format');
      }
  
      const userId = decodedToken.user._id;
  
      // Find the user by ID
      const user = await userModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const verified = await userModel.findByIdAndUpdate(userId, {isVerified: true})
      if (!verified) {
        return res.status(404).json({ message: 'User is not verified yet' });
      }
  
      // Update the user's verification status
    //   user.isVerified = true;
    //   await user.save();
  
      res.status(200).json({ message: `User with Email: ${user.email} verified successfully` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };



const resendEmailVerification = async(req, res)=>{
    try {
        const { email } = req.body;
        const user = await userModel.findOne({email});
        if (!user) {
            res.status(404).json({
                message: 'User not found'
            })
        }else {
            const token = await jwt.sign({user}, process.env.JWT_SECRET, {expiresIn: "5m"});
            await jwt.verify(token, process.env.JWT_SECRET, (err)=>{
                if(err) {
                    res.json('This Link is Expired. Please try again')
                } else {   
                    
                        const subject = 'Kindly RE-VERIFY'
                        const link = `https://creativentstca.onrender.com/#/api/verify?token=${token}`
                        const message = `Welcome onBoard, kindly use this link ${link} to re-verify your account. Kindly note that this link will expire after 5(five) Minutes.`
                        html = generateDynamicEmail(link, user.firstname)
                        sendEmail({
                            email: user.email,
                            subject,
                            html
                        });
                        res.status(200).json({
                            message: `Verification email sent successfully to your email: ${user.email}`
                        })
                    
                }
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


const logIn = async(req, res)=>{
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({email});
        if (!user) {
          return  res.status(404).json({
                message: 'User not found'
            });
        }   
        if (user.isBlocked){
            return res.status(403).json({
                message: "This account has been blocked"
            })
        }
         else {
            if(!user.isVerified) {
                res.status(400).json({
                    message: 'User not verified'
                })
            } else {
                const isPassword = await bcrypt.compare(password, user.password);
                if(!isPassword) {
                    res.status(400).json({
                        message: 'Incorrect Password'
                    });
                } else {
                    const userLogin = await userModel.findByIdAndUpdate(user._id, {islogin: true});
                    const loginToken = await genToken(user, {expiresIn: '1d'});
                    user.token = loginToken
                    await user.save()

                    res.status(200).json({
                        message: 'Log in Successful',
                        token: loginToken,
                        data:user
                    });
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};



const signOut = async(req, res)=>{
    try {
        const { id } = req.params;
        token = ' ';
        const userLogout = await userModel.findByIdAndUpdate(id, {token: token});
        const logout = await userModel.findByIdAndUpdate(id, {islogin: false});
        // userLogout.token = ' ';
        // user.islogin = false;
        if(!userLogout) {
            res.status(400).json({
                message: 'User not logged out'
            })
        } else {
            res.status(200).json({
                message: 'User Successfully logged out',
                data: userLogout
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

// Gen-Token Function
const genToken = async(user,time)=>{
    const token = await jwt.sign({
        userId: user._id,
        username: user.username,
        email: user.email
    }, process.env.JWT_SECRET, time)
    return token
};


const changePassword = async(req, res)=>{
    try {
        const { password } = req.body;
        const { id } = req.params;
        const userpassword = await userModel.findById(id);
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const final = await userModel.findByIdAndUpdate(userpassword, {password: hash}, {new: true});
        if (!final) {
            res.status(400).json({
                message: 'Failed to Change Password'
            })
        } else {
            res.status(200).json({
                message: 'Password Changed Successfully',
                data: userpassword
            })
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


const forgotPassword = async (req, res)=>{
    try {
        const { email } = req.body;
        const isEmail = await userModel.findOne({ email });
        if (!isEmail) {
            res.status(404).json({
                message: 'Email not found'
            })
        } else {
            const token = jwt.sign({
                id:isEmail.id
            }, process.env.JWT_SECRET, {expiresIn: '5m'})
            const subject = 'Link for Reset password'
            const link = `https://creativentstca.onrender.com/#/api/changepassword/${isEmail._id}/${token}`
            const message = `Forgot your Password? it's okay, kindly use this link ${link} to re-set your account password. Kindly note that this link will expire after 5(five) Minutes.`
            const html = generatePasswordEmail(link)
            sendEmail({
                email,
                subject,
                html
            });
            res.status(200).json({
                message: 'Email sent successfully, please check your Email for the link to reset your Password'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};


const resetPassword = async (req, res) => {
    try {
        const {token} = req.params;
        const registeredToken = token;
        const { password } = req.body;
        const { id } = req.params;
        const userpassword = await userModel.findById(id);
        if (!userpassword) {
            res.status(404).json({
                message: 'User not found'
            })
        } else {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            const final = await userModel.findByIdAndUpdate(userpassword, {password: hash}, {new: true});
            await jwt.verify(registeredToken, process.env.JWT_SECRET, (err)=>{
                if(err) {
                    res.json('This Link is Expired. Send another Password Verification')
                } else {
                    if(!final){
                        res.status(404).json({
                            message: 'Failed to change Password'
                        })
                    } else {
                        res.status(200).json({
                            message: `Password changed successfully`
                        })
                    }
                }
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


//add profile picture
// update profile
const addProfilePicture = async (req, res) => {
    try {
      const profile = await userModel.findById(req.params.id);
      if (profile) {
        console.log(profile)
        //console.log(req.file);
        let result = null;
        console.log(req.files)
        // Delete the existing image from local upload folder and Cloudinary
        if (req.files) {
          if (profile.profilePicture) {
            const publicId = profile.profilePicture
              .split("/")
              .pop()
              .split(".")[0];
            console.log(publicId);
            await cloudinary.uploader.destroy(publicId);
          }
          const result= await cloudinary.uploader.upload(
            req.files.profilePicture.tempFilePath,{folder:"profilePicture"},
            (err, profilePicture) => {
              try {
                return profilePicture;
              } catch (err) {
                return err;
              }
            }
          );
          
          profile.set({
            profilePicture: result.secure_url,
          });
          await profile.save();
  
          const updated = await userModel.findById(req.params.id);
  
          res
            .status(200)
            .json({ message: "profile updated successfully", data: updated });
        } else {
          res.status(400).json({ error: "no profile picture added" });
        }
      } else {
        res.status(404).json({ error: "profile not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };



// Update and Delete a User 
// Updating a User.
const updateUsers = async (req, res)=>{
    try {
        const { username, email, firstname, lastname } = req.body;
        const user = await userModel.findById(req.userId);
            const data = {
                username: username || user.username,
                email: email || user.email,
                firstname:firstname || user.firstname, 
                lastname:lastname || user.lastname
            };
            const updateUser = await userModel.findByIdAndUpdate(req.userId, data, {new: true});
            if (!updateUser) {
                res.status(400).json({
                    message: 'Failed to Update User'
                })
            } else {
                res.status(200).json({
                    message: 'User updated successfully',
                    data: updateUser
                })
            }
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


const followUser = async (req, res) => {
    const {followId} = req.params;
  
    try {
      // User is authenticated, continue with event creation
      
      const user = await userModel.findById(req.userId).exec()
      // Check if the user is authenticated
      if (!user) {
        return res.status(401).json({ message: 'User not authenticated. Please log in or sign up to follow a user.' });
      }
  
      // Find the user to follow by its ID
      const followedUser = await userModel.findById(followId);
      if (!followedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      //Check if a user is trying to follow themself
      if (followId === req.userId) {
        return res.status(400).json({ message: 'You cannot follow yourself' });
      }

      // Check if the user is already following the other user
      if (user.following.includes(followId)) {
        return res.status(400).json({ message: 'You are already following this User' });
      }
  
      // Add the user ID to the user's following array
      user.following.unshift(followId);

    //   Add the follower's ID to the followers array
    followedUser.followers.unshift(req.userId)
      // Save the updated users
      await user.save();
      await followedUser.save()

      res.status(200).json({ message: 'User has been Successfully Followed' });
    } catch (error) {
      res.status(500).json({ message: 'Error following this User', error: error.message });
    }
  };
  
  const unfollowUser = async (req, res) => {
    const { unfollowId } = req.params;
  
    try {
      // User is authenticated, continue with unfollowing
      
      const user = await userModel.findById(req.userId).exec()
      // Check if the user is authenticated
      if (!user) {
        return res.status(401).json({ message: 'User not authenticated. Please log in or sign up.' });
      }
  
      // Find the user by its ID
      const unfollowedUser = await userModel.findById(unfollowId);
      if (!unfollowedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      //Check if a user is trying to follow themself
      if (unfollowId === req.userId) {
        return res.status(400).json({ message: 'You cannot follow yourself' });
      }

      // Check if the user is following the unfollowedUser
      if (!user.following.includes(unfollowId)) {
        return res.status(400).json({ message: 'You are not following this user' });
      }
      
      // Remove the user ID from the user's following array
      const stringArray1 = user.following.map(objectId => objectId.toString());
        user.following = stringArray1.filter(followingId => followingId !== unfollowId);

        const stringArray2 = unfollowedUser.followers.map(objectId => objectId.toString());
        unfollowedUser.followers = stringArray2.filter(followersId => followersId !== req.userId)
      // Save the updated user
      await user.save();
      await unfollowedUser.save();

      res.status(200).json({ message: 'User has been Successfully UnFollowed' });
    } catch (error) {
      res.status(500).json({ message: 'Error unfollowing this User', error: error.message });
    }
  };




// FUNCTIONALITIES FOR isSuperAdmin ALONE
//Only Super Admin can do these functions.
const createAdmin = async (req, res)=>{
    try {
        const { username, email, password } = req.body;
        const isEmail = await userModel.findOne({email});
        if (isEmail) {
            res.status(400).json({
                message: `User with this Email: ${email} already exist.`
            })
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash( password, salt )
            const token = await jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '1d'});
            const data = {
                username,
                email: email.toLowerCase(),
                password: hashPassword,
                token: token,
                isAdmin: true
            };
            const user = new userModel(data);
            const savedUser = await user.save();
            const subject = 'Kindly Verify'
            const link = `${req.protocol}://${req.get('host')}/api/verify/${savedUser._id}/${token}`
            const message = `Welcome onBoard, kindly use this link ${link} to verify your account. Kindly note that this link will expire after 5(five) Minutes.`
            sendEmail({
                email: savedUser.email,
                subject,
                message
            });
            if (!savedUser) {
                res.status(400).json({
                    message: 'Failed to Create Account'
                })
            } else {
                res.status(201).json({
                    message: 'Successfully created account',
                    data: savedUser
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};



// For Super Admin
const allAdminUsers = async (req, res)=>{
    try {
        const adminUsers = await userModel.find({isAdmin: true})
        if (adminUsers.length == 0) {
            res.status(404).json({
                message: 'No Admin Users'
            })
        } else {
            res.status(200).json({
                message: 'All Admin Users',
                data: adminUsers
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};




// Upgrade a User to an Admin.
const makeAdmin = async (req, res)=>{
    try {
        const { userId } = req.params;
        const userInfo = await userModel.findById(userId);
        if (!userInfo) {
            res.status(404).json({
                message: 'User does not Exist'
            })
        } else {
            const user = await userModel.findByIdAndUpdate(userId, {isAdmin: true});
            const subject = `Congratulation Admin ${userInfo.username}`
            const message = `Welcome onBoard, You are an Admin for this Product. You now have access rights of an Admin.`
            sendEmail({
                email: userInfo.email,
                subject,
                message
            });
            res.status(200).json({
                message: `Congratulations, ${userInfo.username} is now an Admin of this Product.`
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};




// Upgrade an Admin to a Super Admin.
const makeSuperAdmin = async (req, res)=>{
    try {
        const { userId } = req.params;
        const userInfo = await userModel.findById(userId);
        if (!userInfo) {
            res.status(404).json({
                message: 'User does not Exist'
            })
        } else {
            const user = await userModel.findByIdAndUpdate(userId, {isSuperAdmin: true});
            const subject = `Congratulation Super Admin ${userInfo.username}`
            const message = `Welcome onBoard, You are a Super Admin for this Product. You now have access rights of a Super Admin.`
            sendEmail({
                email: userInfo.email,
                subject,
                message
            });
            if (!user) {
                res.status(400).json({
                    message: 'Could not make Super Admin'
                })
            } else {
                res.status(200).json({
                    message: `Congratulations, ${userInfo.username} is now a Super Admin of this Product.`
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};



const getUserProfile = async (req,res) => {
    try {
      const userId = req.params.id
      const user = await userModel.findById(userId)
        .populate('bookmarks')
        .populate('myEventsLink')
        .populate('following')
        .populate('followers')
        .populate({
          path: 'myticketsLink',
          populate: {
            path: 'link', // to populate a field in a field
            model: 'event' // the model of the field to populate
          }
        });
  
        res.status(200).json({ data: user });
    } catch (error) {
      throw new Error('Error fetching user with linked fields: ' + error.message);
    }
  };








module.exports = {
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
    followUser,
    unfollowUser,
    getUserProfile,
    createAdmin,
    allAdminUsers,
    makeAdmin,
    makeSuperAdmin
};
// e choke