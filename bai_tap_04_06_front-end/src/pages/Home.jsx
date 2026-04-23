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
        if (cancelled) {
          return;
        }
        setTours(Array.isArray(data) ? data : []);
      } catch (err) {
        if (cancelled) {
          return;
        }
        setError(err instanceof Error ? err.message : 'Khong tai duoc danh sach tour.');
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
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-10 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-100 via-sky-50 to-indigo-100 p-6 shadow-lg">
        <h1 className="border-l-4 border-blue-500 pl-4 text-3xl font-black text-slate-800">
          Tour du lich hien co
        </h1>
        <p className="mt-2 italic text-slate-600">Chon tour, nhap so khach va de Orchestrator xu ly booking.</p>
      </header>

      {isLoading ? <p className="text-slate-600">Dang tai lich chieu...</p> : null}
      {error ? <p className="mb-4 rounded-lg bg-rose-100 px-4 py-3 text-rose-600">{error}</p> : null}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {tours.map((tour) => {
          const displayName = tour?.name || `Tour #${tour?.id ?? ''}`;
          const displayPrice = Number(tour?.price ?? 0);
          const tourKey = String(tour?.id ?? `tour-${displayName}`);
          const imageUrl =
            tour?.image || tour?.imageUrl || randomImagesByTour[tourKey] || FALLBACK_IMAGE;

          return (
            <div
              key={tour.id}
              onClick={() => openTourDetail(tour)}
              className="cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-200/60"
            >
              <img src={imageUrl} alt={displayName} className="h-56 w-full object-cover" />
              <div className="p-4">
                <h3 className="mb-1 text-lg font-bold text-slate-800">{displayName}</h3>
                <p className="mb-2 text-xl font-extrabold text-blue-700">{displayPrice.toLocaleString()}d / khach</p>
                <p className="mb-4 text-sm text-slate-500">Con lai: {tour?.stock ?? 'N/A'} cho</p>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    openTourDetail(tour);
                  }}
                  className="mb-2 w-full rounded-lg border border-slate-200 bg-slate-100 py-2 font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  Xem thong tin
                </button>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    openTourDetail(tour);
                  }}
                  className="w-full rounded-lg border border-blue-300 bg-blue-50 py-2 font-semibold text-blue-700 transition hover:bg-blue-500 hover:text-white"
                >
                  Dat tour
                </button>
              </div>
            </div>
          );
        })}

        {!isLoading && !error && tours.length === 0 ? (
          <div className="col-span-full rounded-lg border border-slate-200 bg-white p-5 text-slate-600 shadow-sm">
            Chua co tour nao tu API.
          </div>
        ) : null}
      </div>

      {selectedTour ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 p-4"
          onClick={closeTourDetail}
        >
          <div className="w-full max-w-3xl rounded-xl border border-slate-200 bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <h2 className="mb-2 text-2xl font-bold text-slate-800">
              {selectedTour?.name || `Tour #${selectedTour?.id ?? ''}`}
            </h2>
            <p className="mb-3 font-bold text-blue-700">
              {Number(selectedTour?.price ?? 0).toLocaleString()}d / khach
            </p>
            <p className="mb-2 text-sm text-slate-500">Ma tour: {selectedTour?.id ?? 'N/A'}</p>
            <p className="mb-4 text-slate-600">
              {selectedTour?.description || 'Tour hien chua co mo ta.'}
            </p>
            <div className="mb-4 rounded-lg border border-blue-100 bg-sky-50 p-4">
              <label className="mb-2 block text-sm font-semibold text-slate-700">So khach</label>
              <input
                type="number"
                min="1"
                value={travelerCount}
                onChange={(event) => setTravelerCount(event.target.value)}
                className="mb-4 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              />
              <label className="mb-2 block text-sm font-semibold text-slate-700">Ghi chu booking</label>
              <input
                type="text"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="VD: phong don, diem don, yeu cau them..."
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              />
              <div className="mt-4 rounded-lg bg-white p-3 text-sm text-slate-700">
                Tam tinh:{' '}
                <span className="font-bold text-blue-700">
                  {(Number(selectedTour?.price ?? 0) * Math.max(1, Number(travelerCount) || 1)).toLocaleString()}d
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleConfirmTour}
                className="flex-1 rounded-lg border border-blue-300 bg-blue-50 py-2 font-semibold text-blue-700 transition hover:bg-blue-500 hover:text-white"
              >
                Tiep tuc dat tour
              </button>
              <button
                onClick={closeTourDetail}
                className="flex-1 rounded-lg border border-slate-300 bg-white py-2 font-semibold text-slate-700 transition hover:bg-slate-100"
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
