import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { orderApi } from '../services/orderApi';
import { getUserIdFromToken } from '../utils/jwt';

const Checkout = () => {
  const navigate = useNavigate();
  const { accessToken, isAuthenticated } = useAuth();
  const { cartItems, totalPrice, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);

  const userId = useMemo(() => getUserIdFromToken(accessToken), [accessToken]);

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      setError('Ban can dang nhap truoc khi dat ve.');
      navigate('/login');
      return;
    }

    if (!userId) {
      setError('Khong doc duoc userId tu token. Vui long dang nhap lai.');
      return;
    }

    if (cartItems.length === 0) {
      setError('Gio ve dang trong, khong the tao don.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        userId,
        paymentType: paymentMethod,
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          seatNumber: item.seatNumber || null,
        })),
      };

      const order = await orderApi.createOrder(payload);
      setCreatedOrder(order);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tao don that bai');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="mb-8 text-center text-3xl font-black text-slate-800">Thanh toan don ve</h1>

      {createdOrder ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-lg">
          <h2 className="mb-3 text-2xl font-bold text-emerald-600">Dat ve thanh cong</h2>
          <p className="mb-2 text-slate-700">Ma dat cho: #{createdOrder?.id}</p>
          <p className="mb-2 text-slate-700">Trang thai: {createdOrder?.status}</p>
          <p className="mb-6 text-slate-700">Tong tien: {Number(createdOrder?.totalAmount || 0).toLocaleString()}d</p>
          <button
            onClick={() => navigate('/')}
            className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            Ve trang chu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="mb-4 border-b border-slate-200 pb-2 text-xl font-semibold text-slate-800">Thong tin ve</h2>
            {cartItems.length === 0 ? (
              <p className="text-slate-600">Gio ve dang trong.</p>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-700">{item.name} x {item.quantity}</span>
                    <span className="font-semibold text-blue-700">
                      {(item.price * item.quantity).toLocaleString()}d
                    </span>
                  </div>
                ))}
              </div>
            )}
            {cartItems.some((item) => item.seatNumber) ? (
              <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm text-slate-600">
                {cartItems.map((item) =>
                  item.seatNumber ? (
                    <p key={`seat-${item.id}`}>
                      Ghe {item.name}: {item.seatNumber}
                    </p>
                  ) : null,
                )}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-6 shadow-lg">
            <div>
              <h2 className="mb-4 border-b border-slate-200 pb-2 text-xl font-semibold text-slate-800">Phuong thuc thanh toan</h2>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3 text-slate-700 hover:bg-slate-50">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-5 w-5 text-blue-600"
                  />
                  <span className="font-medium">Thanh toan tai rap (COD)</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3 text-slate-700 hover:bg-slate-50">
                  <input
                    type="radio"
                    name="payment"
                    value="BANK"
                    checked={paymentMethod === 'BANK'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-5 w-5 text-blue-600"
                  />
                  <span className="font-medium">Thanh toan online (BANK)</span>
                </label>
              </div>
            </div>

            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between text-lg font-bold text-slate-800">
                <span>Tong thanh toan:</span>
                <span className="text-2xl text-blue-700">{totalPrice.toLocaleString()}d</span>
              </div>
              {error ? <p className="mb-3 text-sm text-rose-400">{error}</p> : null}
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting || cartItems.length === 0}
                className="w-full rounded-lg bg-blue-600 py-3 text-lg font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Dang xu ly don ve...' : 'Xac nhan dat ve'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
