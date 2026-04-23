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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <h2 className="mb-2 text-center text-2xl font-black text-blue-700">Dang nhap UniCinema</h2>
        <p className="mb-6 text-center text-sm text-slate-600">Mo phong ve phim trong vai cham.</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-slate-700">Email/Ten dang nhap</label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-slate-700">Mat khau</label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error ? (
            <p className="text-sm text-rose-400">{error}</p>
          ) : null}
          <button
            className="w-full rounded-lg bg-blue-600 py-2 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Dang dang nhap...' : 'Dang nhap'}
          </button>
        </form>
        <p className="mt-4 text-center text-slate-600">
          Chua co tai khoan? <Link to="/register" className="font-semibold text-blue-700">Dang ky ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
