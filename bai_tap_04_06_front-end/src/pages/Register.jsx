import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    try {
      await authApi.register({ username, email, password, fullName });
      setSuccess('Dang ky thanh cong. Vui long dang nhap.');
      setTimeout(() => navigate('/login'), 700);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dang ky that bai');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <h2 className="mb-2 text-center text-2xl font-black text-blue-700">Tao tai khoan UniCinema</h2>
        <p className="mb-6 text-center text-sm text-slate-600">Nhan uu dai dat ve som moi tuan.</p>
        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-slate-700">Ten dang nhap</label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-slate-700">Ho va ten</label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-slate-700">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          {error ? <p className="text-sm text-rose-400">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-300">{success}</p> : null}
          <button
            className="w-full rounded-lg bg-blue-600 py-2 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Dang dang ky...' : 'Dang ky'}
          </button>
        </form>
        <p className="mt-4 text-center text-slate-600">
          Da co tai khoan? <Link to="/login" className="font-semibold text-blue-700">Dang nhap</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
