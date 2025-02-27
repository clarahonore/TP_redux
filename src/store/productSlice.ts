import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    brand?: string;
    category: string;
    rating: number;
    thumbnail: string;
    images?: string[];
    discountPercentage?: number;
    stock?: number;
}
export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
    const response = await fetch("https://dummyjson.com/products?limit=100");
    if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des produits: ${response.statusText}`);
    }
    const data = await response.json();
    return data.products;
});

// État initial
const initialState = {
    allItems: [] as Product[],
    filteredItems: [] as Product[],
    isLoading: false,
    error: null as string | null,
};

// Définition du slice Redux
const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        filterProducts: (
            state,
            action: PayloadAction<{ searchTerm: string; selectedCategory: string; selectedBrand: string; minPrice: number; maxPrice: number; sortOption: string }>
        ) => {
            const { searchTerm, selectedCategory, selectedBrand, minPrice, maxPrice, sortOption } = action.payload;

            state.filteredItems = state.allItems
                .filter((product) => product.title.toLowerCase().includes(searchTerm.toLowerCase()))
                .filter((product) => (selectedCategory ? product.category === selectedCategory : true))
                .filter((product) => (selectedBrand ? product.brand === selectedBrand : true))
                .filter((product) => product.price >= minPrice && product.price <= maxPrice)
                .sort((a, b) => {
                    if (sortOption === "price-asc") return a.price - b.price;
                    if (sortOption === "price-desc") return b.price - a.price;
                    if (sortOption === "rating") return b.rating - a.rating;
                    return 0;
                });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allItems = action.payload;
                state.filteredItems = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Erreur inconnue";
            });
    },
});

export const { filterProducts } = productSlice.actions;
export default productSlice.reducer;