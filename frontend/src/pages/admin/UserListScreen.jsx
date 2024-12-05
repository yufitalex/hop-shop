import React from 'react'
import {LinkContainer} from 'react-router-bootstrap'
import {Table, Button, Row, Col} from 'react-bootstrap'
import {FaTimes, FaEdit, FaTrash, FaCheck} from 'react-icons/fa'
import Message from '../../features/Message'
import Loader from '../../features/Loader'

import { toast } from 'react-toastify'
import { useDeleteUserMutation, useGetUsersQuery } from '../../slices/usersApiSlice'

const UserListScreen = () => {
    const { data : users, isLoading, error, refetch } = useGetUsersQuery()
    /* const [createProduct, { isLoading: loadingCreate}] = useCreateProductMutation()*/
    const [deleteUser, { isLoading: loadingDelete}] = useDeleteUserMutation() 

    const handleDelete = async (userId)=>{
        if(window.confirm('Are you sure you want to delete this user?'))
        try {
            const res =await deleteUser(userId).unwrap()
            refetch()
       toast.success(res.message)
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
       
    }
   
  return (
    
     <>
      <h1>Users</h1>
      {loadingDelete&& <Loader/>}
      {isLoading ? <Loader/> : error ? <Message variant={'danger'}>{error.message}</Message>:(
        <Table striped  hover responsive className='table-sm'>
          <thead>
             <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
             
             </tr>
          </thead>
          <tbody>
            {users?.map(user =>(
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                <td>{user.isAdmin ?<FaCheck style={{color:'green'}}/>:<FaTimes style={{color:'red'}}/>}</td>
                
                 <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                     <Button variant='light' className='btn-sm'><FaEdit/></Button>
                  </LinkContainer>
                  <Button variant='danger' className='btn-sm mx-2' onClick={()=>handleDelete(user._id)}><FaTrash style={{color: 'white'}}/></Button>
                 </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>

     
  )
}

export default UserListScreen