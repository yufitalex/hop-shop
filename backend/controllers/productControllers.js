import fs from 'fs'
import path from 'path'
import asyncHandler from '../middleware/asyncHandler.js';
import { AppError } from '../middleware/errorMiddleware.js';
import {Product, Review} from '../models/productModel.js'


//@desc  Fetch All Products
//@route GET /api/products
//access Public
export const getProducts = asyncHandler(async (req, res, next)=>{
const perPage = Number(req.query.perPage) || 8
console.log(req.query);

const page = Number(req.query.pageNumber) || 1

const keyword = req.query.keyword ? { name:{$regex: req.query.keyword , $options: 'i'}} :{}
const count = await Product.countDocuments({...keyword})
 const products = await Product.find({...keyword})
 .limit(perPage)
 .skip(perPage *(page - 1))
 res.json({
   products,
   page,
   pages: Math.ceil(count / perPage)
 });
})
//@desc  Create a Product
//@route POST /api/products
//access Private / Admin
export const createProduct = asyncHandler(async (req, res, next)=>{
 const product = new Product({
    name:'Sample name',
    price:0,
    user: req.user._id,
    image: `/images/sample.png`,
    brand:'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description'
 })
 const createdProduct = await product.save()
 res.status(201).json(createdProduct);
})
//@desc  Update a Product
//@route PATCH /api/products/:id
//access Private / Admin
export const updateProduct = asyncHandler(async (req, res, next)=>{
    const {id} = req.params
    const {name, price, brand, image, description, category,countInStock } = req.body
    const product = await Product.findById(id)
    if (!product) return next(new AppError(404, 'No product found to update'))
        product.name = name
        product.price = price
        product.brand = brand
        product.image = image
        product.description = description
        product.category = category
        product.countInStock = countInStock
        
 const updatedProduct = await product.save()
 res.status(201).json(updatedProduct);
})
//@desc  Delete a Product
//@route Delete /api/products/:id
//access Private / Admin
export const deleteProduct = asyncHandler(async (req, res, next)=>{
    const {id} = req.params
    
    const product = await Product.findById(id)
    if (!product) return next(new AppError(404, 'No product found to delete'))
    await Product.deleteOne({_id: product._id})

    ///removing the product image from the server on product delete
       const __dirname = path.resolve()
        const filepath = path.join(__dirname,`${product.image}`)
       
         fs.unlink(filepath, ()=>{
            console.log('The image removed');  
         });
 res.status(200).json(
    {
        message: 'Product has been removed'
    }
 );
})
//@desc  Fetch Product
//@route GET /api/products/:id
//access Public
export const getProductById = asyncHandler(async (req, res, next)=>{
    const product = await Product.findById(req.params.id)
    if (product)
    res.json(product)
   else{
    res.status(404)
    throw new Error('Resource Not Found')
   }
   })
//@desc  Get Top Tated Products
//@route GET /api/products/top
//access Public
export const getTopProducts = asyncHandler(async (req, res, next)=>{
    const products = await Product.find().sort({rating: -1}).limit(3)
    if (products)
    res.status(200).json(products)
   else{
    res.status(404)
    throw new Error('Resource Not Found')
   }
   })

   //@desc  Create a new review
//@route Post /api/products/:id/review
//access Private 
export const createProductReview = asyncHandler(async (req, res, next)=>{
   const {rating, comment} = req.body
   const {id} = req.params
   const product = await Product.findById(id)
   if (!product) return next(new AppError(404, 'No product found '))

const alreadyReviewed = product.reviews.find(review => review.user.toString() === req.user._id.toString())
if(alreadyReviewed) return next(new AppError(400, 'The product has been already reviewed by the user'))

 const review = new Review({name: req.user.name, 
   rating: Number(rating), 
   comment,user: req.user._id 
}) 
product.reviews.push(review)
product.numReviews = product.reviews.length
product.rating = product.reviews.reduce ((sum,review)=>sum + review.rating, 0)/product.numReviews

await product.save()
res.status(201).json(
   {
       message: 'Review has been added'
   }
);
})