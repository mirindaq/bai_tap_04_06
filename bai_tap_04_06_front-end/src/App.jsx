import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Import Navbar
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />

          <div className="min-h-screen bg-[radial-gradient(circle_at_15%_10%,rgba(255,173,88,0.35),transparent_28rem),radial-gradient(circle_at_85%_0%,rgba(35,134,97,0.18),transparent_26rem),linear-gradient(135deg,#fff8ea_0%,#f7e6c7_48%,#e9f3dd_100%)]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
