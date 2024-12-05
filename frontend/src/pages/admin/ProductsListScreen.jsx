import React from 'react'
import {LinkContainer} from 'react-router-bootstrap'
import {Table, Button, Row, Col} from 'react-bootstrap'
import {FaTimes, FaEdit, FaTrash} from 'react-icons/fa'
import Message from './../../features/Message'
import Loader from './../../features/Loader'
import {useGetProductsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation} from './../../slices/productsApiSlice'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import Paginate from '../../components/Paginate'

const ProductsListScreen = () => {
    const pageNumber = useParams()
    const { data, isLoading, error, refetch } = useGetProductsQuery(pageNumber)
    const [createProduct, { isLoading: loadingCreate}] = useCreateProductMutation()
    const [deleteProduct, { isLoading: loadingDelete}] = useDeleteProductMutation()
    

    const handleDelete = async (productId)=>{
        if(window.confirm('Are you sure you want to delete this product?'))
        try {
            const res =await deleteProduct(productId).unwrap()
            refetch()
       toast.success('Product deleted')
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
       
    }
    const handleCreateProduct =async ()=>{
        if(window.confirm('Are you sure you want to create new product?')){
            try {
                await createProduct()
                refetch()
            } catch (err) {
                toast.error(err?.data?.message || err.message)
            }
        }
    }
  return (
    <>
    <Row className='align-items-center'>
        <Col>
            <h1>Products</h1>
        </Col>
        <Col className="text-end">
        <Button className="btn-sm m-3" onClick={handleCreateProduct}>
            <FaEdit/> Create Product
        </Button>
        </Col>
    </Row>
    {loadingCreate &&<Loader/>}
    {loadingDelete &&<Loader/>}
    {isLoading? <Loader/> : error? <Message variant={'danger'}>{error.data.message}</Message>:(
        <>
        <Table striped bordered hover responsive className='table-sm'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>PRICE</th>
                    <th>CATEGORY</th>
                    <th>BRAND</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    data?.products.map(product=>(
                        <tr key={product._id}>
                            <td>{product._id}</td>
                            <td>{product.name}</td>
                            <td>{product.price}$</td>
                            <td>{product.category}</td>
                            <td>{product.brand}</td>
                            <td>
                                <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                   <Button variant='light' className="btn-sm mx-2"><FaEdit/></Button>
                                </LinkContainer>
                                <Button onClick={()=>handleDelete(product._id)} variant='danger' className='btn-sm'>
                                    <FaTrash style={{color:'white'}}/>
                                </Button>

                            </td>
                        </tr>
                    ))
                }
            </tbody>

        </Table>
  <Paginate page={data.page} pages={data.pages} isAdmin={true}/>
        </>

    )}
    </>
  )
}

export default ProductsListScreen