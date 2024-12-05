
import { Col, Row } from "react-bootstrap";
import Product from "../features/Product";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Loader from "../features/Loader";
import Message from "../features/Message";
import { Link, useParams } from "react-router-dom";
import Paginate from "../components/Paginate";
import Meta from "../components/Meta";
import ProductCarousel from "../components/ProductCarousel";
const HomeScreen = () => {
  const {pageNumber, keyword} = useParams()
  const {data, isLoading, error} = useGetProductsQuery({keyword,pageNumber})

  return (
    <>
    {!keyword ? <ProductCarousel/> :  <Link to='/' className="btn btn-light mb-4">Go Back</Link>}
    { isLoading ?
     (<Loader/>)
      : error ? (
      <Message variant={'danger'}>{ error?.data?.message ||error.error}</Message>
      ) :( 
        <>
        <Meta/>
      <Row>
        {data.products?.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
      <Paginate  page={data.page} pages={data.pages} keyword={keyword? keyword :''}/>
      </>
      
      ) }
     
    </>
  );
};

export default HomeScreen;
