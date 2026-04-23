import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-md backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3 text-blue-700">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-blue-300 bg-blue-50 text-sm font-black">
            UT
          </span>
          <span className="hidden text-xl font-extrabold tracking-wide sm:block">UniTour</span>
        </Link>

        <div className="mx-8 hidden flex-1 md:flex">
          <input
            type="text"
            placeholder="Tim tour, diem den, lich khoi hanh..."
            className="w-full rounded-full border border-slate-200 bg-white px-5 py-2 text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="flex items-center gap-5">
          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-sm text-slate-700">Xin chao, {user?.username || 'Ban'}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="font-medium text-slate-700 transition hover:text-blue-600"
              >
                Dang xuat
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="font-medium text-slate-700 transition hover:text-blue-600">
                Dang nhap
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
