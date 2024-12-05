import asyncHandler from '../middleware/asyncHandler.js';
import { AppError } from '../middleware/errorMiddleware.js';
import Order from '../models/orderModel.js'
import { Product } from '../models/productModel.js';
import { calcPrices } from '../utils/calcPrices.js';
import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypal.js';
//@desc  Create new order
//@route POST /api/orders
//access Private
export const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    // get the ordered items from our database
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    // map over the order items and use the price from our items from database
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    // calculate prices
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});
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
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const { verified, value } = await verifyPayPalPayment(req.body.id);
  if (!verified) throw new Error('Payment not verified');

  // check if this transaction has been used before
  const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
  if (!isNewTransaction) throw new Error('Transaction has been used before');

  const order = await Order.findById(req.params.id);

  if (order) {
    // check the correct amount was paid
    const paidCorrectAmount = order.totalPrice.toString() === value;
    if (!paidCorrectAmount) throw new Error('Incorrect amount paid');

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});
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