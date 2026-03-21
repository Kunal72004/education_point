import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: localStorage.getItem("cart") ? localStorage.getItem("cart") : [],
    total: localStorage.getItem("total") ? localStorage.getItem("total") : 0,
    totalItems: localStorage.getItem("totalItems") ? localStorage.getItem("totalItems") : 0
}

const cartSlice = createSlice({
    name:"cart",
    initialState:initialState,
    reducers:{
       
    }
})

// export const {} = cartSlice.actions;
export default cartSlice.reducer;