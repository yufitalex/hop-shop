import React, {useEffect, useState} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {Form, Button} from 'react-bootstrap'
import FormContainer from '../../components/FormContainer'
import Message from '../../features/Message'
import Loader from '../../features/Loader'
import {toast}from 'react-toastify'
import { useGetProductByIdQuery, useUpdateProductMutation, useUploadProductImageMutation } from '../../slices/productsApiSlice'

const ProductEditScreen = () => {
  const {id: productId} = useParams()
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [countInStock, setCountInStock] = useState(0)

  const {data: product, isLoading, refetch, error } = useGetProductByIdQuery(productId)
  const [updateProduct, {isLoading : loadingUpdate }] = useUpdateProductMutation()
  const [uploadProductImage, {isLoading : loadingUpload }] = useUploadProductImageMutation()

  const navigate = useNavigate()
  
  useEffect(()=>{
    if(product){
      setName(product.name)
      setPrice(product.price)
      setBrand(product.brand)
      setCategory(product.category)
      setDescription(product.description)
      setImage(product.image)
      setCountInStock(product.countInStock)

    }
  }, [product] )
  const handleSubmit = async(e)=>{
    e.preventDefault()
    try{
    const res = await updateProduct ({name, price, brand, image, description, category,countInStock, productId})
    
    toast.success('Product updated successfully') 
    navigate('/admin/productlist')
  }
  catch(err){
    toast.error(res.err)
  }}
  const uploadFileHandler= async(e)=>{
    const formData = new FormData()
    formData.append('image',e.target.files[0])
    try {
      const res = await uploadProductImage(formData).unwrap()
      toast.success(res.message)
      setImage(res.image)
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
    
  }
   
  return (
    <>
    <Link to='/admin/productlist' className='btn btn-light my-3'>
    Go Back
    </Link>
    <FormContainer>
      <h1>Edit Product</h1>
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

           <Form.Group controlId='price' className='my-2'>
             <Form.Label>Price</Form.Label>
             <Form.Control 
             type='number'  
             placeholder='Enter price' 
             value={price}
             onChange={(e)=>setPrice(e.target.value)}>
             </Form.Control>
           </Form.Group>

         

    {/*   IMAGE INPUT PLACEHOLDER HERE */}

           <Form.Group controlId='image' className='my-2'>
             <Form.Label>Image</Form.Label>
             <Form.Control 
             type='text'  
             placeholder='Enter image url' 
             value={image}
             onChange={(e)=>setImage(e.target.value)}>
             </Form.Control>
             <Form.Control 
             type='file'  
             label ='Choose file' 
             
             onChange={uploadFileHandler}>
             </Form.Control>
           </Form.Group>

           <Form.Group controlId='brand' className='my-2'>
             <Form.Label>Brand</Form.Label>
             <Form.Control 
             type='text'  
             placeholder='Enter brand' 
             value={brand}
             onChange={(e)=>setBrand(e.target.value)}>
             </Form.Control>
           </Form.Group>

           <Form.Group controlId='countInStock' className='my-2'>
             <Form.Label>Count In Stock</Form.Label>
             <Form.Control 
             type='number'  
             placeholder='Enter count in stock' 
             value={countInStock}
             onChange={(e)=>setCountInStock(Number(e.target.value))}>
             </Form.Control>
           </Form.Group>

           <Form.Group controlId='category' className='my-2'>
             <Form.Label>Category</Form.Label>
             <Form.Control 
             type='text'  
             placeholder='Enter category' 
             value={category}
             onChange={(e)=>setCategory(e.target.value)}>
             </Form.Control>
           </Form.Group>

           <Form.Group controlId='description' className='my-2'>
             <Form.Label>Description</Form.Label>
             <Form.Control 
             type='text'  
             placeholder='Enter description' 
             value={description}
             onChange={(e)=>setDescription(e.target.value)}>
             </Form.Control>
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

export default ProductEditScreen