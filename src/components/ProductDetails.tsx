import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { useParams } from "react-router-dom";
import { addToCart } from "../store/cartSlice";
import { addToWishlist, removeFromWishlist } from "../store/wishlistSlice";
import React, { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const [notification, setNotification] = useState<string | null>(null);
  const [fadeOut, setFadeOut] = useState(false);

  const products = useSelector((state: RootState) => state.product.allItems);
  if (!products || products.length === 0) return <p className="text-center text-gray-500 mt-8">Chargement des produits...</p>;

  const product = products.find((p) => p.id.toString() === id);
  if (!product) return <p className="text-center text-gray-500 mt-8">Produit non trouvé</p>;

  const showNotification = (message: string) => {
    setNotification(message);
    setFadeOut(false);
    setTimeout(() => setFadeOut(true), 1500);
    setTimeout(() => setNotification(null), 2000);
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity: 1 }));
    showNotification("Produit ajouté au panier !");
  };

  const toggleWishlist = () => {
    if (wishlist.includes(product.id)) {
      dispatch(removeFromWishlist(product.id));
      showNotification("Retiré des favoris !");
    } else {
      dispatch(addToWishlist(product.id));
      showNotification("Ajouté aux favoris !");
    }
  };

  const hasDiscount = product.discountPercentage !== undefined && product.discountPercentage > 0;
  const discountedPrice = hasDiscount
      ? product.price - (product.price * (product.discountPercentage ?? 0)) / 100
      : product.price;

  return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        {notification && (
            <div className={`fixed top-20 right-4 bg-orange text-white px-4 py-2 rounded shadow-lg transition-all ${fadeOut ? "animate-fade-out" : "animate-slide-in"}`}>
              {notification}
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img src={product.thumbnail} alt={product.title} className="w-full h-auto object-cover rounded-lg shadow-lg mb-4" />
            {product.images && product.images.length > 0 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((img: string, index: number) => (
                      <img key={index} src={img} alt={`Image ${index + 1}`} className="w-20 h-20 object-cover rounded-lg shadow-md hover:scale-110 transition-transform cursor-pointer" />
                  ))}
                </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold text-gray-800">{product.title}</h1>
              <button onClick={toggleWishlist} className="text-orange text-3xl">
                {wishlist.includes(product.id) ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>

            <p className="text-gray-600 text-lg mt-2">Catégorie : <span className="font-semibold">{product.category}</span></p>
            <p className="text-gray-600 text-lg mt-2">
              Stock : <span className={product.stock > 0 ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
                        {product.stock > 0 ? "Disponible" : "Rupture de stock"}
                    </span>
            </p>

            <div className="mt-4 text-xl font-semibold">
              {hasDiscount ? (
                  <>
                    <span className="text-green-500 line-through mr-2">{product.price.toFixed(2)} EUR</span>
                    <span className="text-orange font-bold">{discountedPrice.toFixed(2)} EUR</span>
                    <span className="ml-2 text-sm text-gray-600">({product.discountPercentage}% de remise)</span>
                  </>
              ) : (
                  <span>{product.price.toFixed(2)} EUR</span>
              )}
            </div>

            <button
                onClick={handleAddToCart}
                className="border-2 border-orange text-orange px-4 py-2 rounded-lg w-full mt-4 hover:bg-orange hover:text-white transition"
                disabled={product.stock <= 0}
            >
              {product.stock > 0 ? "Ajouter au panier" : "Indisponible"}
            </button>
          </div>
        </div>
      </div>
  );
};

export default ProductDetails;