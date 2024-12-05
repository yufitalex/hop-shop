import React from 'react'
import {Row, Col, ListGroup, Form, Button, Card, ListGroupItem, Image} from 'react-bootstrap'
import { FaTrash } from 'react-icons/fa'
import Message from '../features/Message'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart,removeFromCart } from '../slices/cartSlice'
const CartScreen = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart)
    const {cartItems} = cart

    const handleAddToCart = async (product, qty) =>{
        dispatch(addToCart({...product, qty}))
    }
    const handleRemoveFromCart = async (id) =>{
        dispatch(removeFromCart(id))
    }
    const handleCheckout = ()=>{
        navigate('/login?redirect=/shipping')
    }
  return (
    <Row>
        <Col md={8}>
        <h1 style={{marginBottom:'20px'}}>Shopping Cart</h1>
        {
            cartItems.length === 0 ?(
                <Message>Your Cart is Empty <Link to='/'> Go Back</Link></Message>
            ):(
                <ListGroup variant='flush'>
                    {
                        cartItems.map(item =>(
                            <ListGroupItem key={item._id}>
                                <Row>
                                    <Col md={2}>
                                      <Image src = {item.image} alt ={item.name} fluid rounded/>
                                    </Col>
                                    <Col md={3}>
                                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={2}>
                                    ${item.price}
                                    </Col>
                                    <Col md={2}>
                                    <Form.Control 
                                        as='select'
                                        value={item.qty}
                                        onChange={(e)=>handleAddToCart(item, Number(e.target.value))}
                                        >
                                        {
                                        [...Array(item.countInStock).keys()].map(x =>
                                            (
                                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                                        ))
                                        }
                                        </Form.Control>
                                    </Col>
                                    <Col><Button type='button' variant='light' onClick={()=>handleRemoveFromCart(item._id)}><FaTrash/></Button></Col>
                                </Row>
                            </ListGroupItem>
                        ))
                    }
                </ListGroup>
            )
        }
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup>
                <ListGroupItem>
                    <h2>
                    
                        Subtotal ({cartItems.reduce((acc, item)=> acc + item.qty, 0)})
                    
                </h2>
                </ListGroupItem>
                <ListGroupItem>
                    <Button type='button' className='btn-block'onClick={handleCheckout} disabled={cartItems.length === 0}>Proceed To Checkout </Button>
                </ListGroupItem>
            </ListGroup>
          </Card>
        </Col>
    </Row>
  )
}

export default CartScreen