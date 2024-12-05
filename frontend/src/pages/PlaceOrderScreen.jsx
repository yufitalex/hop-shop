import React, {useEffect} from 'react'
import {Link, useNavigate }from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {Button, Row, Col, ListGroup,Image, Card } from 'react-bootstrap'
import { toast } from 'react-toastify'
import CheckoutSteps from '../components/CheckoutSteps'
import Message from '../features/Message'
import Loader from '../features/Loader'
import { useCreateOrderMutation } from '../slices/ordersApiSlice'
import { clearCartItems } from '../slices/cartSlice'

const PlaceOrderScreen = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [createOrder,{isLoading, error} ] = useCreateOrderMutation()
    const cart = useSelector(state => state.cart)
    const {shippingAddress, paymentMethod} = cart
    
        useEffect(()=>{
            if(!shippingAddress.address){
              navigate('/shipping')
            }
            else if (!paymentMethod){
                navigate('/payment')
            }
          },[shippingAddress, paymentMethod, navigate])
  const handlePlaceOrder = async()=>{
     try{
       const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice : cart.shippingPrice,
        taxPrice : cart.taxPrice,
        totalPrice : cart.totalPrice,

       }).unwrap()
       //console.log(res);
       
       dispatch(clearCartItems())
      navigate(`/order/${res._id}`)
     }catch(error){
        toast.error(error)
     }
  }
  return (
    <>
    <CheckoutSteps step1 step2 step3 step4/>
    <Row>
       <Col md={8} >
         <ListGroup variant='flush'>
            <ListGroup.Item>
                <h2>Shipping</h2>
                <p>
                    <strong>Address:  </strong>
                    {shippingAddress.address},{shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
                </p>
            </ListGroup.Item>
            <ListGroup.Item>
                <h2>Payment</h2>
                <p>
                    <strong>Payment Method:  </strong>
                    {cart.paymentMethod}
                </p>
            </ListGroup.Item>
            <ListGroup.Item>
                <h2>Order Items</h2>
                { cart.cartItems.length === 0 ? (
                    <Message>Your cart is empty</Message>
                ):(
                    <ListGroup variant='flush'>
                       {cart.cartItems.map((item, index) =>(
                        <ListGroup.Item key={index}>
                            <Row>
                                <Col md={1}>
                                 <Image fluid rounded src={item.image} alt={item.name}/>
                                </Col>
                                <Col>
                                 <Link to={`../products/${item._id}`}>
                                 {item.name}
                                 </Link>
                                </Col>
                                <Col md={4}>
                                {item.qty} x ${item.price} = ${item.qty * item.price}
                                </Col>
                            </Row>
                        </ListGroup.Item>

                       ))}
                    </ListGroup>
                ) }
            </ListGroup.Item>
         </ListGroup>
       </Col>
       <Col md={4} >
          <Card>
            <ListGroup variant='flush'>
                <ListGroup.Item>
                    <h2>Order Summary</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                   <Row>
                     <Col>Items:</Col>
                     <Col>${cart.itemsPrice}</Col>
                   </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                   <Row>
                     <Col>Shipping:</Col>
                     <Col>${cart.shippingPrice}</Col>
                   </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                   <Row>
                     <Col>VAT:</Col>
                     <Col>${cart.taxPrice}</Col>
                   </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                   <Row>
                     <Col>Total:</Col>
                     <Col>${cart.totalPrice}</Col>
                   </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                    {error && <Message variant={'danger'}>{error}</Message>}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button 
                  type='button' 
                  className='btn-block' 
                  disabled={cart.cartItems.length === 0} 
                  onClick = {handlePlaceOrder}>
                    Place Order
                  </Button>
                  { isLoading && <Loader/>}
                </ListGroup.Item>
            </ListGroup>
          </Card>
       </Col>
    </Row>
    </>
  )
}

export default PlaceOrderScreen