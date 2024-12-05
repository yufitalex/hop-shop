import React, {useEffect, useState} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {Form, Button} from 'react-bootstrap'
import FormContainer from '../../components/FormContainer'
import Message from '../../features/Message'
import Loader from '../../features/Loader'
import {toast}from 'react-toastify'
import {useGetUserDetailsQuery, useUpdateUserMutation} from '../../slices/usersApiSlice'
const UserUpdateScreen = () => {
  const {id: userId} = useParams()
  const [name, setName] = useState('')
  const [email, setEmail] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)
  

  const {data: user, isLoading, refetch, error } = useGetUserDetailsQuery(userId)
  const [updateUser, {isLoading : loadingUpdate }] = useUpdateUserMutation(userId)
 

  const navigate = useNavigate()
  
  useEffect(()=>{
    if(user){
      setName(user.name)
      setEmail(user.email)
      setIsAdmin(user.isAdmin)

    }
  }, [user] )
  const handleSubmit = async(e)=>{
    e.preventDefault()
    try{
    const res = await updateUser ({name,email,isAdmin, userId})
   
    toast.success('User has been updated successfully') 
    navigate('/admin/userlist')
  }
  catch(err){
    toast.error(res.err)
  }}

   
  return (
    <>
    <Link to='/admin/userlist' className='btn btn-light my-3'>
    Go Back
    </Link>
    <FormContainer>
      <h1>Edit User</h1>
      {loadingUpdate && <Loader/>}
      {isLoading ?<Loader/> : error ? <Message variant={'danger'}>{error}</Message>:(
        <Form onSubmit={handleSubmit}>
           <Form.Group controlId='name' className='my-2'>
             <Form.Label>Name</Form.Label>
             <Form.Control 
             type='name'  
             placeholder='Enter name' 
             value={name}
             onChange={(e)=>setName(e.target.value)}>
             </Form.Control>
           </Form.Group>

           <Form.Group controlId='email' className='my-2'>
             <Form.Label>Email</Form.Label>
             <Form.Control 
             type='email'  
             placeholder='Enter email' 
             value={email}
             onChange={(e)=>setEmail(e.target.value)}>
             </Form.Control>
           </Form.Group>

         

   


           <Form.Group controlId='admin' className='my-2'>
             <Form.Label>Admin</Form.Label>
             <Form.Check 
             type='checkbox'  
            label='Is Admin' 
             checked={isAdmin}
             onChange={(e)=>setIsAdmin(Boolean(e.target.checked))}>
             </Form.Check>
           </Form.Group>

  
           <Button
           type='submit'
           variant='primary'
           className='my-2'>
             Update
           </Button>
        </Form>
      )}
    </FormContainer>
    </>
  )
}

export default UserUpdateScreen