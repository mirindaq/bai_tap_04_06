import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { orchestratorApi } from '../services/orchestratorApi';
import { getUserIdFromToken } from '../utils/jwt';

const Checkout = () => {
  const navigate = useNavigate();
  const { accessToken, isAuthenticated } = useAuth();
  const { cartItems, totalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [bookingResult, setBookingResult] = useState(null);

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
      setError('Chua co tour nao de dat.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const selectedTour = cartItems[0];
      const payload = {
        userId,
        tourId: selectedTour.id,
        quantity: selectedTour.quantity,
        seatNumber: selectedTour.seatNumber || null,
      };

      const result = await orchestratorApi.bookTour(payload);
      setBookingResult(result);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dat tour that bai');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="mb-8 text-center text-3xl font-black text-slate-800">Xac nhan dat tour</h1>

      {bookingResult ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-lg">
          <h2 className="mb-3 text-2xl font-bold text-emerald-600">Dat tour thanh cong</h2>
          <p className="mb-2 text-slate-700">Thong bao: {bookingResult?.message || 'Orchestrator da xu ly thanh cong'}</p>
          <p className="mb-2 text-slate-700">Ma booking: #{bookingResult?.booking?.id}</p>
          <p className="mb-2 text-slate-700">Tour: {bookingResult?.tour?.name}</p>
          <p className="mb-2 text-slate-700">Trang thai booking: {bookingResult?.booking?.status}</p>
          <p className="mb-6 text-slate-700">
            Tong tien: {Number(bookingResult?.booking?.totalAmount || 0).toLocaleString()}d
          </p>
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
            <h2 className="mb-4 border-b border-slate-200 pb-2 text-xl font-semibold text-slate-800">Thong tin tour</h2>
            {cartItems.length === 0 ? (
              <p className="text-slate-600">Chua co tour nao.</p>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-700">{item.name} x {item.quantity} khach</span>
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
                      Ghi chu {item.name}: {item.seatNumber}
                    </p>
                  ) : null,
                )}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-6 shadow-lg">
            <div>
              <h2 className="mb-4 border-b border-slate-200 pb-2 text-xl font-semibold text-slate-800">Luong xu ly</h2>
              <div className="space-y-3 text-sm text-slate-700">
                <p className="rounded-lg border border-slate-200 bg-slate-50 p-3">1. Orchestrator validate User Service</p>
                <p className="rounded-lg border border-slate-200 bg-slate-50 p-3">2. Orchestrator lay Tour Service</p>
                <p className="rounded-lg border border-slate-200 bg-slate-50 p-3">3. Orchestrator tao Booking trong Order Service</p>
                <p className="rounded-lg border border-slate-200 bg-slate-50 p-3">4. Orchestrator goi Payment Service</p>
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
                {isSubmitting ? 'Dang goi Orchestrator...' : 'Xac nhan dat tour'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
