import {Link ,useLocation, useNavigate} from 'react-router-dom'
import React,{ useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Row, Col } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import Loader from '../features/Loader'
import { useRegisterMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice';
import {toast} from 'react-toastify'


const RegisterScreen = () => {
  const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const dispatch = useDispatch()
    const navigate =  useNavigate()
    const [register, {isLoading}] = useRegisterMutation()                        
  const {userInfo} = useSelector(state => state.auth )

  const {search} = useLocation()
  const sp = new URLSearchParams(search)
  const redirect = sp.get('redirect') || '/'

  useEffect(()=>{
    if(userInfo){
        navigate(redirect)
    }
  },[userInfo, redirect, navigate])
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await register({ name,email, password, passwordConfirm }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error );
    }
  };

  return (
    <FormContainer>
        <h1>Sign In</h1>
        <Form onSubmit={submitHandler}>
            <Form.Group>
                <Form.Label>Full Name</Form.Label>
                <Form.Control type='text'
                 placeholder='Enter full name'
                  value={name} 
                  onChange={(e)=>setName(e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>Email Address</Form.Label>
                <Form.Control type='email'
                 placeholder='Enter email'
                  value={email} 
                  onChange={(e)=>setEmail(e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control type='password'
                 placeholder='Enter password'
                  value={password} 
                  onChange={(e)=>setPassword(e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type='password'
                 placeholder='Confirm your password'
                  value={passwordConfirm} 
                  onChange={(e)=>setPasswordConfirm(e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Button type='submit' variant='primary' className='mt-2' disabled={isLoading}>Register</Button>
            {isLoading&&<Loader/>}
        </Form>
        <Row className="py-3">
            <Col>
              Already a customer ? <Link to={redirect ? `/login?redirect=${redirect}`: '/login'}>Login</Link>
            </Col>
        </Row>
    </FormContainer>
  )
}

export default RegisterScreen