import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import ProductDetails from "./components/ProductDetails";
import Cart from "./components/Cart";
import ProductList from "./components/ProductList";
import Wishlist from "./components/Wishlist";

const App = () => {
  return (
      <Router>
        <div className="w-full min-h-screen bg-beige">
          {/* Navbar en vert */}
          <nav className="flex items-center justify-between px-8 py-4 bg-vert">
            {/* Logo texte avec police Bungee Shade */}
            <h1 className="text-4xl font-logo font-bold text-white">Golden Cart</h1>

            {/* Menu avec police Lexend Tera */}
            <div className="flex space-x-6">
              <Link className="text-white text-lg font-menu hover:underline" to="/">Accueil</Link>
              <Link className="text-white text-lg font-menu hover:underline" to="/cart">Panier</Link>
              <Link className="text-white text-lg font-menu hover:underline" to="/wishlist">WishList</Link>
            </div>
          </nav>

          {/* Routes */}
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Routes>
        </div>
      </Router>
  );
};

export default App;