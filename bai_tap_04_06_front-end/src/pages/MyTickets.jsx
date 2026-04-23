import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { orderApi } from '../services/orderApi';
import { getUserIdFromToken } from '../utils/jwt';

const formatDateTime = (value) => {
  if (!value) {
    return 'N/A';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString('vi-VN');
};

const MyTickets = () => {
  const navigate = useNavigate();
  const { isAuthenticated, accessToken } = useAuth();
  const userId = useMemo(() => getUserIdFromToken(accessToken), [accessToken]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!userId) {
      setError('Khong doc duoc userId tu token. Vui long dang nhap lai.');
      return;
    }

    let cancelled = false;
    const loadMyOrders = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await orderApi.getMyOrders(userId);
        if (!cancelled) {
          setOrders(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Khong tai duoc danh sach ve da dat.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadMyOrders();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, navigate, userId]);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <header className="mb-6 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-100 via-sky-50 to-indigo-100 p-6 shadow-lg">
        <h1 className="border-l-4 border-blue-500 pl-4 text-3xl font-black text-slate-800">Ve da dat</h1>
        <p className="mt-2 text-slate-600">Danh sach don ve cua ban.</p>
      </header>

      {isLoading ? <p className="text-slate-600">Dang tai danh sach ve...</p> : null}
      {error ? <p className="mb-4 rounded-lg bg-rose-100 px-4 py-3 text-rose-600">{error}</p> : null}

      {!isLoading && !error && orders.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-5 text-slate-600 shadow-sm">
          Ban chua co don ve nao.
        </div>
      ) : null}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold text-slate-800">Don #{order.id}</p>
              <p className="text-sm text-slate-500">{formatDateTime(order.orderDate)}</p>
            </div>
            <div className="mb-3 flex flex-wrap gap-4 text-sm text-slate-700">
              <p>Trang thai: <span className="font-semibold">{order.status}</span></p>
              <p>Thanh toan: <span className="font-semibold">{order.paymentType}</span></p>
              <p>Tong tien: <span className="font-semibold text-blue-700">{Number(order.totalAmount || 0).toLocaleString()}d</span></p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              {(order.details || []).map((detail) => (
                <div key={detail.id} className="mb-2 text-sm text-slate-700 last:mb-0">
                  <span className="font-semibold">Phim #{detail.productId}</span> x {detail.quantity} - {Number(detail.unitPrice || 0).toLocaleString()}d
                  {detail.seatNumber ? ` - Ghe: ${detail.seatNumber}` : ''}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTickets;
