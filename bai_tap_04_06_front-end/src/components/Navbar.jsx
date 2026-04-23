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
    <nav className="sticky top-0 z-50 border-b border-amber-900/10 bg-[#fff8ea]/85 shadow-[0_10px_35px_rgba(88,58,24,0.10)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3 text-[#2f6f4e]">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff8a3d] to-[#e74c2f] text-sm font-black text-white shadow-lg shadow-orange-900/20">
            UT
          </span>
          <span className="hidden text-2xl font-black tracking-tight sm:block">UniTour</span>
        </Link>

        <div className="mx-8 hidden flex-1 md:flex">
          <input
            type="text"
            placeholder="Tim tour, diem den, lich khoi hanh..."
            className="w-full rounded-full border border-amber-900/10 bg-white/75 px-5 py-2.5 text-[#4b382d] shadow-inner outline-none transition-all placeholder:text-[#9b7a5b] focus:border-[#2f6f4e] focus:ring-4 focus:ring-[#2f6f4e]/15"
          />
        </div>

        <div className="flex items-center gap-5">
          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-3">
              <span className="rounded-full bg-white/70 px-4 py-2 text-sm font-bold text-[#4b382d] shadow-sm">Xin chao, {user?.username || 'Ban'}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-[#2f6f4e] px-4 py-2 font-bold text-white shadow-md shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-[#24583e]"
              >
                Dang xuat
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/register" className="rounded-full border border-[#2f6f4e]/20 bg-white/70 px-5 py-2 font-bold text-[#2f6f4e] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#ecf5df]">
                Dang ky
              </Link>
              <Link to="/login" className="rounded-full bg-[#2f6f4e] px-5 py-2 font-bold text-white shadow-md shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-[#24583e]">
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
