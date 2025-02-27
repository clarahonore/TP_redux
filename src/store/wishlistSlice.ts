import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistState {
    items: number[];
}

const initialState: WishlistState = {
    items: [],
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        addToWishlist: (state, action: PayloadAction<number>) => {
            if (!state.items.includes(action.payload)) {
                state.items.push(action.payload);
            }
        },
        removeFromWishlist: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(id => id !== action.payload);
        },
    },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;