import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

const initialState = localStorage.getItem('cart')
 ?
 JSON.parse(localStorage.getItem('cart')) 
 :
 { cartItems:[], shippingAddress: {}, paymentMethod:'PayPal'}



const cartSlice = createSlice({
    name:'cart',
    initialState,
    reducers:{

    addToCart :(state, action)=>{
      const item = action.payload
      const existItem = state.cartItems.find(product => product._id === item._id)
      if (existItem){
        state.cartItems = state.cartItems.map(product => product._id === item._id ? {...product, qty:item.qty+1} : product )
      }
      else{
        state.cartItems = [...state.cartItems, item]
      }
     return updateCart(state)
    }//addToCart
    ,
    removeFromCart:(state, action)=>{
        state.cartItems = state.cartItems.filter(item => item._id != action.payload)
        return updateCart(state)
    },
    saveShippingAddress: (state, action) =>{
      state.shippingAddress = action.payload
      return updateCart(state)
    },
    savePaymentMethod: (state, action) =>{
      state.paymentMethod = action.payload
      return updateCart(state)
    },
    clearCartItems : (state, action) =>{
      state.cartItems = []
      return updateCart(state)
    },
    resetCart: (state)=> state = initialState

    
} //reducers
    
    
})//createSlice
export const {addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCartItems, resetCart} = cartSlice.actions
export default cartSlice.reducer