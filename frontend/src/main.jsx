import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store.js";
import "./assets/styles/bootstrap.custom.css";
import "./assets/styles/index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import {PayPalScriptProvider} from '@paypal/react-paypal-js'
import {HelmetProvider} from'react-helmet-async'
import HomeScreen from "./pages/HomeScreen.jsx";
import ProductScreen from "./pages/ProductScreen.jsx";
import CartScreen from "./pages/cartScreen.jsx";
import LoginScreen from "./pages/LoginScreen.jsx";
import RegisterScreen from "./pages/RegisterScreen.jsx";
import ShippingScreen from "./pages/ShippingScreen.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import PaymentScreen from "./pages/PaymentScreen.jsx";
import PlaceOrderScreen from "./pages/PlaceOrderScreen.jsx";
import OrderScreen from "./pages/OrderScreen.jsx";
import ProfileScreen from "./pages/ProfileScreen.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import OrderListScreen from "./pages/admin/OrderListScreen.jsx";
import ProductsListScreen from "./pages/admin/ProductsListScreen.jsx";
import ProductEditScreen from "./pages/admin/ProductEditScreen.jsx";
import UserListScreen from "./pages/admin/UserListScreen.jsx";
import UserUpdateScreen from "./pages/admin/UserUpdateScreen.jsx";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/search/:keyword' element={<HomeScreen />} /> 
      <Route path='/page/:pageNumber' element={<HomeScreen />} /> 
      <Route path='/search/:keyword/page/:pageNumber' element={<HomeScreen />} /> 
      <Route path='/products/:id' element={<ProductScreen />} />
      <Route path='/cart' element={<CartScreen />} />
      <Route path='/login' element={<LoginScreen/>} />
      <Route path='/register' element={<RegisterScreen/>} />
     

      <Route path="" element = {<PrivateRoute/>}>
          <Route path='/shipping' element={<ShippingScreen/>} />
          <Route path='/payment' element={<PaymentScreen/>} />
          <Route path='/placeorder' element={<PlaceOrderScreen/>} />
          <Route path='/order/:id' element={<OrderScreen/>} />
          <Route path='/profile' element={<ProfileScreen/>} />
          
      </Route>
      <Route path="" element = {<AdminRoute/>}>
          <Route path='/admin/orderlist' element={<OrderListScreen/>} />
          <Route path='/admin/productlist' element={<ProductsListScreen/>} />
          <Route path='/admin/productlist/:pageNumber' element={<ProductsListScreen/>} />
          <Route path='/admin/product/:id/edit' element={<ProductEditScreen/>} />
          <Route path='/admin/userlist' element={<UserListScreen/>} />
          <Route path='/admin/user/:id/edit' element={<UserUpdateScreen/>} />
          
         
          
      </Route>
    </Route>
  )
);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PayPalScriptProvider deferLoading={true}>
        <RouterProvider router={router} />
        </PayPalScriptProvider>
    
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);
