import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, changeQuantity, removeItem } = useCart();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="mb-6 text-3xl font-black text-slate-100">Gio ve cua ban</h1>

      {cartItems.length === 0 ? (
        <p className="text-slate-300">Gio ve dang trong.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900 shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800 text-slate-200">
                <th className="p-4">Phim</th>
                <th className="p-4 text-center">Gia ve</th>
                <th className="p-4 text-center">So ve</th>
                <th className="p-4 text-center">Tam tinh</th>
                <th className="p-4 text-center">Xoa</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id} className="border-b border-slate-800 text-slate-200 hover:bg-slate-800/60">
                  <td className="p-4 flex items-center gap-4">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <span className="font-semibold">{item.name}</span>
                  </td>
                  <td className="p-4 text-center">{item.price.toLocaleString()}d</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => changeQuantity(item.id, -1)}
                        className="rounded bg-slate-700 px-2 py-1"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => changeQuantity(item.id, 1)}
                        className="rounded bg-slate-700 px-2 py-1"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-center font-semibold text-cyan-300">
                    {(item.price * item.quantity).toLocaleString()}d
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-rose-400 hover:text-rose-300"
                    >
                      Xoa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between bg-slate-950 p-6">
            <span className="text-xl font-bold text-slate-200">
              Tong tien ve: <span className="text-cyan-300">{totalPrice.toLocaleString()}d</span>
            </span>
            <button
              onClick={() => navigate('/checkout')}
              className="rounded-lg bg-cyan-400 px-6 py-2 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Dat ve va thanh toan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
