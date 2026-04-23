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
      setError('Ban can dang nhap truoc khi dat tour.');
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
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-8 text-center text-4xl font-black text-[#2f241d]">Xac nhan dat tour</h1>

      {bookingResult ? (
        <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_25px_70px_rgba(88,58,24,0.16)] backdrop-blur">
          <h2 className="mb-3 text-3xl font-black text-[#2f6f4e]">Dat tour thanh cong</h2>
          <p className="mb-2 text-[#4b382d]">Thong bao: {bookingResult?.message || 'Orchestrator da xu ly thanh cong'}</p>
          <p className="mb-2 text-[#4b382d]">Ma booking: #{bookingResult?.booking?.id}</p>
          <p className="mb-2 text-[#4b382d]">Tour: {bookingResult?.tour?.name}</p>
          <p className="mb-2 text-[#4b382d]">Trang thai booking: {bookingResult?.booking?.status}</p>
          <p className="mb-6 text-[#4b382d]">Tong tien: {Number(bookingResult?.booking?.totalAmount || 0).toLocaleString()}d</p>
          <button
            onClick={() => navigate('/')}
            className="rounded-2xl bg-[#2f6f4e] px-6 py-3 font-black text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-[#24583e]"
          >
            Ve trang chu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-[1.7rem] border border-white/70 bg-white/85 p-6 shadow-[0_18px_45px_rgba(88,58,24,0.12)] backdrop-blur">
            <h2 className="mb-4 border-b border-amber-900/10 pb-2 text-xl font-black text-[#2f241d]">Thong tin tour</h2>
            {cartItems.length === 0 ? (
              <p className="text-[#7a5b42]">Chua co tour nao.</p>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="font-bold text-[#4b382d]">{item.name} x {item.quantity} khach</span>
                    <span className="font-black text-[#e75f35]">{(item.price * item.quantity).toLocaleString()}d</span>
                  </div>
                ))}
              </div>
            )}
            {cartItems.some((item) => item.seatNumber) ? (
              <div className="mt-4 rounded-2xl bg-[#fff3dc] p-4 text-sm text-[#7a5b42]">
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

          <div className="flex flex-col justify-between rounded-[1.7rem] border border-white/70 bg-white/85 p-6 shadow-[0_18px_45px_rgba(88,58,24,0.12)] backdrop-blur">
            <div>
              <h2 className="mb-4 border-b border-amber-900/10 pb-2 text-xl font-black text-[#2f241d]">Luong xu ly</h2>
              <div className="space-y-3 text-sm font-bold text-[#4b382d]">
                <p className="rounded-2xl border border-[#2f6f4e]/10 bg-[#ecf5df] p-3">1. Orchestrator validate User Service</p>
                <p className="rounded-2xl border border-[#2f6f4e]/10 bg-[#ecf5df] p-3">2. Orchestrator lay Tour Service</p>
                <p className="rounded-2xl border border-[#2f6f4e]/10 bg-[#ecf5df] p-3">3. Orchestrator tao Booking trong Order Service</p>
                <p className="rounded-2xl border border-[#2f6f4e]/10 bg-[#ecf5df] p-3">4. Orchestrator goi Payment Service</p>
              </div>
            </div>

            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between text-lg font-black text-[#2f241d]">
                <span>Tong thanh toan:</span>
                <span className="text-2xl text-[#e75f35]">{totalPrice.toLocaleString()}d</span>
              </div>
              {error ? <p className="mb-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-[#c2412d]">{error}</p> : null}
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting || cartItems.length === 0}
                className="w-full rounded-2xl bg-gradient-to-r from-[#ff8a3d] to-[#e75f35] py-3 text-lg font-black text-white shadow-lg shadow-orange-900/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
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
