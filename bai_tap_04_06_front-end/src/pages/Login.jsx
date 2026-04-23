import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: saveLoginState, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const response = await authApi.login({ login, password });
      saveLoginState(response?.data ?? null);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dang nhap that bai');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center p-6">
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_30px_80px_rgba(88,58,24,0.18)] backdrop-blur">
        <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-[#ff8a3d]/25" />
        <div className="absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-[#2f6f4e]/20" />
        <div className="relative">
        <p className="mb-3 text-center text-xs font-black uppercase tracking-[0.28em] text-[#e75f35]">Travel desk</p>
        <h2 className="mb-2 text-center text-3xl font-black text-[#2f241d]">Dang nhap UniTour</h2>
        <p className="mb-7 text-center text-sm text-[#7a5b42]">Dat tour qua Orchestrator trong vai cham.</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block font-bold text-[#4b382d]">Email/Ten dang nhap</label>
            <input
              type="text"
              className="w-full rounded-2xl border border-amber-900/10 bg-[#fff8ea] px-4 py-3 text-[#4b382d] outline-none transition focus:border-[#2f6f4e] focus:ring-4 focus:ring-[#2f6f4e]/15"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block font-bold text-[#4b382d]">Mat khau</label>
            <input
              type="password"
              className="w-full rounded-2xl border border-amber-900/10 bg-[#fff8ea] px-4 py-3 text-[#4b382d] outline-none transition focus:border-[#2f6f4e] focus:ring-4 focus:ring-[#2f6f4e]/15"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error ? (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-[#c2412d]">{error}</p>
          ) : null}
          <button
            className="w-full rounded-2xl bg-gradient-to-r from-[#ff8a3d] to-[#e75f35] py-3 font-black text-white shadow-lg shadow-orange-900/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Dang dang nhap...' : 'Dang nhap'}
          </button>
        </form>
        <p className="mt-5 text-center text-sm font-semibold text-[#7a5b42]">
          Chua co tai khoan?{' '}
          <Link to="/register" className="font-black text-[#2f6f4e] hover:text-[#24583e]">
            Dang ky ngay
          </Link>
        </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
