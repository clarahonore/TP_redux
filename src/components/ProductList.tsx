import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import React, { useState, useEffect } from "react";
import { fetchProducts, filterProducts, Product } from "../store/productSlice";
import { addToCart } from "../store/cartSlice";
import { addToWishlist, removeFromWishlist } from "../store/wishlistSlice";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const ProductList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { allItems, filteredItems, isLoading, error } = useSelector((state: RootState) => state.product);
    const wishlist = useSelector((state: RootState) => state.wishlist.items);

    const [notification, setNotification] = useState<string | null>(null);
    const [fadeOut, setFadeOut] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [sortOption, setSortOption] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const filteredProducts = allItems
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

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const displayedProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

    const resetFilters = () => {
        setSearchTerm("");
        setSelectedCategory("");
        setSelectedBrand("");
        setMinPrice(0);
        setMaxPrice(1000);
        setSortOption("");
        setCurrentPage(1);
    };

    const showNotification = (message: string) => {
        setNotification(message);
        setFadeOut(false);
        setTimeout(() => setFadeOut(true), 1500);
        setTimeout(() => setNotification(null), 2000);
    };

    const toggleWishlist = (id: number) => {
        if (wishlist.includes(id)) {
            dispatch(removeFromWishlist(id));
            showNotification("Retiré des favoris !");
        } else {
            dispatch(addToWishlist(id));
            showNotification("Ajouté aux favoris !");
        }
    };

    const handleAddToCart = (product: Product) => {
        dispatch(addToCart({ ...product, quantity: 1 }));
        showNotification("Produit ajouté au panier !");
    };

    if (isLoading) return <p className="text-center text-gray-500 mt-8">Chargement...</p>;
    if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 bg-white">
            {notification && (
                <div className={`fixed top-20 right-4 bg-orange text-white px-4 py-2 rounded shadow-lg transition-all ${fadeOut ? "animate-fade-out" : "animate-slide-in"}`}>
                    {notification}
                </div>
            )}

            <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Liste des Produits</h1>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher..."
                    className="p-2 border-2 border-orange rounded-lg w-full bg-white text-gray-700"
                />
                <select className="p-2 border-2 border-orange rounded-lg bg-white text-gray-700" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="">Toutes les catégories</option>
                    {[...new Set(allItems.map((p: Product) => p.category))].map((category) => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <select className="p-2 border-2 border-orange rounded-lg bg-white text-gray-700" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                    <option value="">Toutes les marques</option>
                    {[...new Set(allItems.map((p: Product) => p.brand))].map((brand) => (
                        <option key={brand} value={brand}>{brand}</option>
                    ))}
                </select>
                <select className="p-2 border-2 border-orange rounded-lg bg-white text-gray-700" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                    <option value="">Trier par</option>
                    <option value="price-asc">Prix : Croissant</option>
                    <option value="price-desc">Prix : Décroissant</option>
                    <option value="rating">Meilleure évaluation</option>
                </select>
                <button onClick={resetFilters} className="border-2 border-orange text-orange px-4 py-2 rounded-lg hover:bg-orange hover:text-white transition w-full">
                    Réinitialiser
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {displayedProducts.map((product: Product) => (
                    <div key={product.id} className="relative bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                        <div className="relative group">
                            <img src={product.thumbnail} alt={product.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                        </div>

                        <h2 className="text-xl font-semibold text-gray-700 mb-2">{product.title}</h2>

                        <button onClick={() => toggleWishlist(product.id)} className="absolute top-2 right-2 text-orange text-2xl">
                            {wishlist.includes(product.id) ? <FaHeart /> : <FaRegHeart />}
                        </button>

                        <button onClick={() => handleAddToCart(product)} className="border-2 border-orange text-orange px-4 py-2 rounded-lg w-full mt-2 hover:bg-orange hover:text-white transition">
                            Ajouter au panier
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-8 space-x-4">
                <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 border-2 border-orange text-orange rounded-lg hover:bg-orange hover:text-white transition">
                    Précédent
                </button>
                <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 border-2 border-orange text-orange rounded-lg hover:bg-orange hover:text-white transition">
                    Suivant
                </button>
            </div>
        </div>
    );
};

export default ProductList;