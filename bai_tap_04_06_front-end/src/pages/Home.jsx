import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { tourApi } from '../services/tourApi';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200';
const RANDOM_TOUR_IMAGES = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200',
  'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1200',
  'https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1200',
];

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { clearCart, addItem } = useCart();
  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTour, setSelectedTour] = useState(null);
  const [travelerCount, setTravelerCount] = useState(1);
  const [note, setNote] = useState('');
  const [randomImagesByTour, setRandomImagesByTour] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      setTours([]);
      setError('Vui long dang nhap de xem danh sach tour.');
      return;
    }

    let cancelled = false;
    const loadTours = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await tourApi.getAll();
        if (!cancelled) {
          setTours(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Khong tai duoc danh sach tour.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadTours();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (tours.length === 0) {
      return;
    }

    setRandomImagesByTour((prev) => {
      const next = { ...prev };
      tours.forEach((tour, index) => {
        const tourKey = String(tour?.id ?? `tour-${index}`);
        if (!next[tourKey]) {
          const randomIndex = Math.floor(Math.random() * RANDOM_TOUR_IMAGES.length);
          next[tourKey] = RANDOM_TOUR_IMAGES[randomIndex];
        }
      });
      return next;
    });
  }, [tours]);

  const openTourDetail = (tour) => {
    setSelectedTour(tour);
    setTravelerCount(1);
    setNote('');
  };

  const closeTourDetail = () => {
    setSelectedTour(null);
    setTravelerCount(1);
    setNote('');
  };

  const handleConfirmTour = () => {
    const quantity = Math.max(1, Number(travelerCount) || 1);
    if (!selectedTour) {
      return;
    }

    clearCart();
    addItem(
      {
        id: selectedTour?.id,
        name: selectedTour?.name || `Tour #${selectedTour?.id ?? ''}`,
        price: Number(selectedTour?.price ?? 0),
        image: selectedTour?.image || selectedTour?.imageUrl || FALLBACK_IMAGE,
        description: selectedTour?.description || '',
        seatNumber: note.trim(),
      },
      quantity,
    );
    closeTourDetail();
    navigate('/checkout');
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <header className="mb-10 overflow-hidden rounded-[2rem] border border-white/70 bg-[#2f6f4e] p-8 text-white shadow-[0_25px_70px_rgba(47,111,78,0.25)]">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.35em] text-[#ffd28a]">Orchestrated travel</p>
        <h1 className="max-w-2xl text-4xl font-black leading-tight md:text-5xl">Tour du lich hien co</h1>
        <p className="mt-4 max-w-2xl text-white/80">
          Chon tour, nhap so khach va de Orchestrator xu ly User, Tour, Booking, Payment.
        </p>
      </header>

      {isLoading ? <p className="rounded-2xl bg-white/70 px-5 py-4 font-bold text-[#7a5b42] shadow-sm">Dang tai danh sach tour...</p> : null}
      {error ? <p className="mb-4 rounded-2xl bg-[#ffe5db] px-5 py-4 font-semibold text-[#c2412d]">{error}</p> : null}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {tours.map((tour) => {
          const displayName = tour?.name || `Tour #${tour?.id ?? ''}`;
          const displayPrice = Number(tour?.price ?? 0);
          const tourKey = String(tour?.id ?? `tour-${displayName}`);
          const imageUrl = tour?.image || tour?.imageUrl || randomImagesByTour[tourKey] || FALLBACK_IMAGE;

          return (
            <div
              key={tour.id}
              onClick={() => openTourDetail(tour)}
              className="group cursor-pointer overflow-hidden rounded-[1.6rem] border border-white/70 bg-white/80 shadow-[0_18px_45px_rgba(88,58,24,0.12)] backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(88,58,24,0.18)]"
            >
              <div className="relative">
                <img src={imageUrl} alt={displayName} className="h-56 w-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute right-3 top-3 rounded-full bg-[#fff8ea]/90 px-3 py-1 text-xs font-black text-[#2f6f4e] shadow">
                  {tour?.stock ?? 'N/A'} cho
                </span>
              </div>
              <div className="p-5">
                <h3 className="mb-2 text-xl font-black text-[#2f241d]">{displayName}</h3>
                <p className="mb-4 text-2xl font-black text-[#e75f35]">{displayPrice.toLocaleString()}d / khach</p>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    openTourDetail(tour);
                  }}
                  className="mb-2 w-full rounded-2xl border border-[#2f6f4e]/20 bg-[#ecf5df] py-2.5 font-black text-[#2f6f4e] transition hover:bg-[#dcebc9]"
                >
                  Xem thong tin
                </button>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    openTourDetail(tour);
                  }}
                  className="w-full rounded-2xl bg-gradient-to-r from-[#ff8a3d] to-[#e75f35] py-2.5 font-black text-white shadow-lg shadow-orange-900/15 transition hover:-translate-y-0.5"
                >
                  Dat tour
                </button>
              </div>
            </div>
          );
        })}

        {!isLoading && !error && tours.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-white/70 bg-white/80 p-6 text-[#7a5b42] shadow-sm">
            Chua co tour nao tu API.
          </div>
        ) : null}
      </div>

      {selectedTour ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2f241d]/45 p-4 backdrop-blur-sm" onClick={closeTourDetail}>
          <div className="w-full max-w-3xl rounded-[2rem] border border-white/70 bg-[#fffaf0] p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <h2 className="mb-2 text-3xl font-black text-[#2f241d]">{selectedTour?.name || `Tour #${selectedTour?.id ?? ''}`}</h2>
            <p className="mb-3 text-xl font-black text-[#e75f35]">{Number(selectedTour?.price ?? 0).toLocaleString()}d / khach</p>
            <p className="mb-2 text-sm font-bold text-[#9b7a5b]">Ma tour: {selectedTour?.id ?? 'N/A'}</p>
            <p className="mb-4 text-[#6b5542]">{selectedTour?.description || 'Tour hien chua co mo ta.'}</p>
            <div className="mb-4 rounded-[1.5rem] border border-[#2f6f4e]/10 bg-[#ecf5df] p-5">
              <label className="mb-2 block text-sm font-black text-[#2f6f4e]">So khach</label>
              <input
                type="number"
                min="1"
                value={travelerCount}
                onChange={(event) => setTravelerCount(event.target.value)}
                className="mb-4 w-full rounded-2xl border border-[#2f6f4e]/10 bg-white px-4 py-3 text-[#4b382d] outline-none focus:border-[#2f6f4e] focus:ring-4 focus:ring-[#2f6f4e]/15"
              />
              <label className="mb-2 block text-sm font-black text-[#2f6f4e]">Ghi chu booking</label>
              <input
                type="text"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="VD: phong don, diem don, yeu cau them..."
                className="w-full rounded-2xl border border-[#2f6f4e]/10 bg-white px-4 py-3 text-[#4b382d] outline-none focus:border-[#2f6f4e] focus:ring-4 focus:ring-[#2f6f4e]/15"
              />
              <div className="mt-4 rounded-2xl bg-white p-4 text-sm font-bold text-[#4b382d]">
                Tam tinh:{' '}
                <span className="font-black text-[#e75f35]">
                  {(Number(selectedTour?.price ?? 0) * Math.max(1, Number(travelerCount) || 1)).toLocaleString()}d
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleConfirmTour}
                className="flex-1 rounded-2xl bg-gradient-to-r from-[#ff8a3d] to-[#e75f35] py-3 font-black text-white shadow-lg shadow-orange-900/15 transition hover:-translate-y-0.5"
              >
                Tiep tuc dat tour
              </button>
              <button
                onClick={closeTourDetail}
                className="flex-1 rounded-2xl border border-[#2f6f4e]/20 bg-white py-3 font-black text-[#2f6f4e] transition hover:bg-[#ecf5df]"
              >
                Dong
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Home;
