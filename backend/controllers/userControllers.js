import asyncHandler from '../middleware/asyncHandler.js';
import { AppError } from '../middleware/errorMiddleware.js';
import User from '../models/userModel.js'

import generateToken from '../utils/generateToken.js';

//@desc  Auth user & get token
//@route POST /api/users/login
//access Public
export const loginUser = asyncHandler(async (req, res, next)=>{
   const {email, password} = req.body
   console.log(
    req.body
   );
   
   const user = await User.findOne({email}).select('+password')
   if(user && (await user.matchPassword(password))){
      generateToken(res, user._id)
   }
   else{
    res.status(401)
    throw new Error('The email or password not match')

   }
    res.status(200).json({
        name:user.name,
        email:user.email,
        _id:user._id,
        isAdmin: user.isAdmin
    })

    
   })

   
//@desc  Register user
//@route POST /api/users
//access Public
export const registerUser = asyncHandler(async (req, res, next)=>{
   const {name, email, password} = req.body
   const userExist = await User.findOne({email})
   if (userExist){
    res.status(400)
    throw new Error('User already exist')
   }
   const user = await User.create({email, password, name})
    
    if (user){
     generateToken(res, user._id)
     res.status(201).json({
        name:user.name,
        email:user.email,
        _id:user._id
    })
    }
    else{
        res.status(401)
      throw new Error('Error creating user')
    }
        
   })
  
   
//@desc  Logout user / clear cookie
//@route POST /api/users/logout
//access Private
export const logoutUser = asyncHandler(async (req, res, next)=>{
   //SET COOKIE
   res.cookie('jwt','', {
    httpOnly:true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    exires: new Date(0)

  })
    res.status(200).json({
        message: 'logged out success'
    });
   })

//@desc  Get user profile
//@route GET /api/users/logout
//access Private
export const getUserProfile  = asyncHandler(async (req, res, next)=>{
      const user = await User.findById(req.user._id)
      if (user){
        res.status(200).json({
            user
        });
      }
    else{
        res.status(404)
        throw new Error('User not found')
    }
    })

//@desc  Update user profile
//@route PUT /api/users/profile
//access Private
export const updateUserProfile  = asyncHandler(async (req, res, next)=>{
    
    const user = await User.findById(req.user._id)
    console.log(user);
    
    if (user){
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password)
            user.password = req.body.password || user.password
        const updatedUser = await user.save()
      res.status(200).json({
        updatedUser
      });
    }
  else{
      res.status(404)
      throw new Error('User not found')
  }
    })
//@desc  Get users
//@route GET /api/users
//access Private/Admin
export const getUsers  = asyncHandler(async (req, res, next)=>{
      const users = await User.find()
    res.status(200).json(users);
    })
//@desc  Get user by id
//@route GET /api/users/:id
//access Private/Admin
export const getUserById  = asyncHandler(async (req, res, next)=>{
  const {id} = req.params
  const user = await User.findById(id)
  if(!user ) return next(new AppError(404, 'Not found'))
  res.status(200).json(user);
  })
//@desc  Delete users
//@route DELETE /api/users/:id
//access Private/Admin
export const deleteUser  = asyncHandler(async (req, res, next)=>{
  const {id} = req.params
  const user = await User.findById(id)
  if(!user ) return next(new AppError(404, 'Not found'))
if (user.isAdmin) return next(new AppError(40, 'Cannot delete an admin user'))
  await User.deleteOne({_id:id})
     res.status(200).json({
      message: 'User has been deleted'
     });
  })
   
  

//@desc  Update user 
//@route PUT /api/users/:id
//access Private/ Admin
export const updateUser  = asyncHandler(async (req, res, next)=>{
  console.log('chipopo');
  
    const {id} = req.params
    
    const user = await User.findById(id)
    console.log(user);
    
    if (user){
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmin = Boolean(req.body.isAdmin)
        if (req.body.password)
            user.password = req.body.password
        const updatedUser = await user.save()
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    }
  else{
      res.status(404)
      throw new Error('User not found')
  }
  })
   
    