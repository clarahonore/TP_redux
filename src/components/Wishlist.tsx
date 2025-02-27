import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { removeFromWishlist } from "../store/wishlistSlice";
import { Link } from "react-router-dom";

const Wishlist = () => {
    const dispatch = useDispatch();
    const wishlist = useSelector((state: RootState) => state.wishlist.items);
    const products = useSelector((state: RootState) => state.product.allItems);

    if (!products || products.length === 0) {
        return <p className="text-center text-gray-500 mt-8">Chargement des produits...</p>;
    }

    const favoriteProducts = products.filter((product) => wishlist.includes(product.id));

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Ma Liste de Favoris</h2>

            {favoriteProducts.length === 0 ? (
                <p className="text-center text-gray-500">Aucun produit en favoris.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {favoriteProducts.map((product) => (
                        <div key={product.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                            <img src={product.thumbnail} alt={product.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">{product.title}</h3>
                            <p className="text-gray-600 mb-2">Prix : {product.price} EUR</p>
                            <div className="flex justify-between items-center">
                                <Link to={`/products/${product.id}`} className="text-blue-500 underline hover:text-blue-700">
                                    Voir le produit
                                </Link>
                                <button onClick={() => dispatch(removeFromWishlist(product.id))}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                                    Retirer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;