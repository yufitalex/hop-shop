import React from "react";
import { Nav, Navbar, Container, Badge, NavDropdown } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import { resetCart } from "../slices/cartSlice";

import logo from "./../assets/logo.png";
import { toast } from "react-toastify";
import SearchBox from "../components/SearchBox";
const Header = () => {
  const {cartItems} = useSelector((state => state.cart))
  const {userInfo} = useSelector((state => state.auth))
  const [logoutApiCall, {isLoading}] = useLogoutMutation()
  const dispatch =  useDispatch()
  const navigate = useNavigate()
  
  const handleLogout = async ()=>{
    try{
    await logoutApiCall().unwrap()
    dispatch(logout())
    dispatch(resetCart())
    navigate('/login')
    }
    catch(err){
      toast.error(err?.data?.message || err.error);
    }
  }
  
  return (
    <header>
      <Navbar bg='info' variant='light' expand='md' collapseOnSelect>
        <Container>
          <LinkContainer to={"/"} className="d-flex align-items-center">
            <Navbar.Brand>
              <img src={logo} alt='Hop-shop' />
            <h2 className="brand-title-font">Hop - Shop </h2> 
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle area-controls='basic-navbar-nav' />
          <Navbar.Collapse>
            <Nav className='ms-auto'>
              <SearchBox/>
              <LinkContainer to='/cart'>
                <Nav.Link to='/cart' className="text-warning">
                  <FaShoppingCart />
                  Cart
                  {
                   cartItems.length > 0 &&(
                      <Badge pill bg='success' style={{marginLeft:'5px'}}>{cartItems.reduce((a,c)=> a + c.qty,0)}</Badge>
                    )
                  }
                </Nav.Link>
              </LinkContainer>
              {userInfo ?(
                <>
                <NavDropdown title={userInfo.name}>
                  <LinkContainer to={'/profile'}>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={handleLogout}>
                          Logout
                  </NavDropdown.Item>
                </NavDropdown>
                </>
              ):( <LinkContainer to='/login' className="text-warning">
                <Nav.Link>
                  <FaUser />
                  Sign In
                </Nav.Link>
              </LinkContainer>)}
             {userInfo && userInfo.isAdmin && (
              <NavDropdown title='Admin' id= 'adminmenu'>
                 <LinkContainer to={'/admin/productlist'}>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                 </LinkContainer>
                 <LinkContainer to={'/admin/userlist'}>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                 </LinkContainer>
                
                 <LinkContainer to={'/admin/orderlist'}>
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                 </LinkContainer>
              </NavDropdown>
             )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
