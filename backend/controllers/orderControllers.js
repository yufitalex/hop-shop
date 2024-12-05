import asyncHandler from '../middleware/asyncHandler.js';
import { AppError } from '../middleware/errorMiddleware.js';
import Order from '../models/orderModel.js'
//@desc  Create new order
//@route POST /api/orders
//access Private
export const addOrderItems = asyncHandler(async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body
  console.log(orderItems);
  
    if (orderItems && orderItems.length === 0){
        res.status(400)
        throw new Error('No order items')
    }
   
    
   
   const order = new Order({
   orderItems: orderItems.map(item =>({...item, product: item._id, _id:undefined})),
   user: req.user._id,
   shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
   })
   //console.log(order);
   
   const createdOrder = await order.save()
   
   
   res.status(201).json(createdOrder)
})
//@desc Get logged in user's orders
//@route GET /api/orders/myorders
//access Private
export const getMyOrders = asyncHandler(async (req, res, next)=>{
 const orders = await Order.find({user: req.user._id})
 res.status(200).json(orders);
})
//@desc Get order by id
//@route GET /api/orders/:id
//access Private
export const getOrderById = asyncHandler(async (req, res, next)=>{
  console.log(req.params.id);
  
 const order = await Order.findById(req.params.id).populate('user','name email')

 
 if (!order) return next(new AppError(407, 'Order not found'))
  console.log('58');
  
    res.status(200).json(order)
})
//@desc Update order to paid
//@route PUT /api/orders/:id/pay
//access Private
export const updateOrderToPaid = asyncHandler(async (req, res, next)=>{
  const order = await Order.findById(req.params.id)
  if (!order) return next(new AppError(404, 'Order not exist'))

    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    }
    const updatedOrder = await order.save()
 res.status(200).json(updatedOrder);
})

//@desc Update order to delivered
//@route GET /api/orders/:id/deliver
//access Private/Admin
export const updateOrderToDelivered = asyncHandler(async (req, res, next)=>{
const {id} = req.params
const order = await Order.findById(id)
if (!order) return next(new AppError(404, 'Not found'))
 order.isDelivered = true
 order.deliveredAt = Date.now()
 const updatedOrder = await order.save()
 res.status(200).json(updatedOrder)
})
//@desc Update order to delivered
//@route GET /api/orders
//access Private/Admin
export const getAllOrders = asyncHandler(async (req, res, next)=>{
  const orders = await Order.find().populate('user', 'id name')
  res.status(200).json(orders);
})