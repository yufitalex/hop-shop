import jwt from 'jsonwebtoken'
import asyncHandler from './asyncHandler.js'
import User from './../models/userModel.js'

//PROTECT
export const protect = asyncHandler(async(req, res, next)=>{
    let token;
    token = req.cookies.jwt
    if(token){
        try{
          const decoded = jwt.verify(token, process.env.JWT_SECRET)
          const user = await User.findById(decoded.userId).select('-password')
          req.user = user
          next()
        }catch(err){
        res.status(401)
        throw new Error('Not authorized, token failed')
        }

    }
    else {
        res.status(401)
        throw new Error('Not authorized, no token')
        
    }
})
export const admin = (req, res, next)=>{
    if (req.user && req.user.isAdmin)
        next()
    else{
        res.status(401)
        throw new Error('Not authorized as admin')
    }
}