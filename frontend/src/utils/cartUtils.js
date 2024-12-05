const addDecimals = (num)=> (Math.round(num * 100 ) /100).toFixed(2);

export const updateCart =(state)=>{

    /// calculate total price for cart
    state.itemsPrice = addDecimals(state.cartItems.reduce((acc, item)=>
         acc + item.price * item.qty , 0))
    
    ////// calculate shipping price 
    state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10)
    //calculate tax 17%
    state.taxPrice = addDecimals(Number(state.itemsPrice * 0.17 ))
    
    state.totalPrice = (Number(state.itemsPrice) + Number(state.shippingPrice)).toFixed(2)
    localStorage.setItem('cart', JSON.stringify(state))
    return state
}