import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { removeFromCart, updateQuantity } from "../store/cartSlice";


const Cart = () => {
   const cartItems = useSelector((state: RootState) => state.cart.items);

    const dispatch = useDispatch();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * (item.quantity ?? 0), 0).toFixed(2);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Votre Panier</h1>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Votre panier est vide.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-4">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">{item.title}</h2>
                <p className="text-gray-600 mb-2">Prix: {(item.price * (item.quantity ?? 0)).toFixed(2)} EUR</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      dispatch(updateQuantity({ id: item.id, quantity: (item.quantity ?? 1) - 1 }))
                    }
                    disabled={(item.quantity ?? 0) <= 1}
                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity ?? 1}                    onChange={(e) =>
                      dispatch(updateQuantity({ id: item.id, quantity: parseInt(e.target.value) || 1 }))
                    }
                    className="w-12 text-center border border-gray-300 rounded"
                  />
                  <button
                    onClick={() =>
                      dispatch(updateQuantity({ id: item.id, quantity: (item.quantity ?? 0) + 1 }))
                    }
                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => dispatch(removeFromCart(item.id))}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          ))}
          <div className="col-span-full text-right">
            <h2 className="text-2xl font-bold text-gray-800">Total: {calculateTotal()} EUR</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
