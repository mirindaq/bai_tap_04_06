import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { productApi } from '../services/productApi';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200';
const RANDOM_MOVIE_IMAGES = [
  'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1200',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1200',
  'https://images.unsplash.com/photo-1460881680858-30d872d5b530?q=80&w=1200',
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200',
  'https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=1200',
];
const SEAT_ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const SEAT_COLUMNS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { clearCart, addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [randomImagesByProduct, setRandomImagesByProduct] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      setProducts([]);
      setError('Vui long dang nhap de xem lich chieu phim.');
      return;
    }

    let cancelled = false;
    const loadProducts = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await productApi.getAll();
        if (cancelled) {
          return;
        }
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        if (cancelled) {
          return;
        }
        setError(err instanceof Error ? err.message : 'Khong tai duoc danh sach phim.');
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (products.length === 0) {
      return;
    }

    setRandomImagesByProduct((prev) => {
      const next = { ...prev };
      products.forEach((product, index) => {
        const productKey = String(product?.id ?? `movie-${index}`);
        if (!next[productKey]) {
          const randomIndex = Math.floor(Math.random() * RANDOM_MOVIE_IMAGES.length);
          next[productKey] = RANDOM_MOVIE_IMAGES[randomIndex];
        }
      });
      return next;
    });
  }, [products]);

  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setSelectedSeats([]);
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
    setSelectedSeats([]);
  };

  const toggleSeat = (seatCode) => {
    setSelectedSeats((prev) =>
      prev.includes(seatCode) ? prev.filter((seat) => seat !== seatCode) : [...prev, seatCode],
    );
  };

  const handleConfirmSeats = () => {
    if (!selectedProduct || selectedSeats.length === 0) {
      alert('Vui long chon it nhat 1 cho ngoi.');
      return;
    }

    clearCart();
    addItem(
      {
        id: selectedProduct?.id,
        name: selectedProduct?.name || `Phim #${selectedProduct?.id ?? ''}`,
        price: Number(selectedProduct?.price ?? 0),
        image: selectedProduct?.image || selectedProduct?.imageUrl || FALLBACK_IMAGE,
        description: selectedProduct?.description || '',
        seatNumber: selectedSeats.join(', '),
      },
      selectedSeats.length,
    );
    setSelectedProduct(null);
    setSelectedSeats([]);
    navigate('/checkout');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-10 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-100 via-sky-50 to-indigo-100 p-6 shadow-lg">
        <h1 className="border-l-4 border-blue-500 pl-4 text-3xl font-black text-slate-800">
          Lich chieu phim hom nay
        </h1>
        <p className="mt-2 italic text-slate-600">Chon phim yeu thich va dat ve nhanh trong 1 cham.</p>
      </header>

      {isLoading ? <p className="text-slate-600">Dang tai lich chieu...</p> : null}
      {error ? <p className="mb-4 rounded-lg bg-rose-100 px-4 py-3 text-rose-600">{error}</p> : null}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => {
          const displayName = product?.name || `Phim #${product?.id ?? ''}`;
          const displayPrice = Number(product?.price ?? 0);
          const productKey = String(product?.id ?? `movie-${displayName}`);
          const imageUrl =
            product?.image || product?.imageUrl || randomImagesByProduct[productKey] || FALLBACK_IMAGE;

          return (
            <div
              key={product.id}
              onClick={() => openProductDetail(product)}
              className="cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-200/60"
            >
              <img src={imageUrl} alt={displayName} className="h-56 w-full object-cover" />
              <div className="p-4">
                <h3 className="mb-1 text-lg font-bold text-slate-800">{displayName}</h3>
                <p className="mb-4 text-xl font-extrabold text-blue-700">{displayPrice.toLocaleString()}d</p>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    openProductDetail(product);
                  }}
                  className="mb-2 w-full rounded-lg border border-slate-200 bg-slate-100 py-2 font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  Xem lich chieu
                </button>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    openProductDetail(product);
                  }}
                  className="w-full rounded-lg border border-blue-300 bg-blue-50 py-2 font-semibold text-blue-700 transition hover:bg-blue-500 hover:text-white"
                >
                  Chon ghe va dat ve
                </button>
              </div>
            </div>
          );
        })}

        {!isLoading && !error && products.length === 0 ? (
          <div className="col-span-full rounded-lg border border-slate-200 bg-white p-5 text-slate-600 shadow-sm">
            Chua co phim nao tu API.
          </div>
        ) : null}
      </div>

      {selectedProduct ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 p-4"
          onClick={closeProductDetail}
        >
          <div className="w-full max-w-3xl rounded-xl border border-slate-200 bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <h2 className="mb-2 text-2xl font-bold text-slate-800">
              {selectedProduct?.name || `Phim #${selectedProduct?.id ?? ''}`}
            </h2>
            <p className="mb-3 font-bold text-blue-700">
              {Number(selectedProduct?.price ?? 0).toLocaleString()}d
            </p>
            <p className="mb-2 text-sm text-slate-500">Ma phim: {selectedProduct?.id ?? 'N/A'}</p>
            <p className="mb-4 text-slate-600">
              {selectedProduct?.description || 'Phim hien chua co mo ta.'}
            </p>
            <div className="mb-4 rounded-lg border border-blue-100 bg-sky-50 p-4">
              <p className="mb-3 text-center text-xs font-semibold tracking-[0.2em] text-slate-500">MAN HINH</p>
              <div className="mb-4 h-2 rounded-full bg-gradient-to-r from-blue-200 via-blue-500/60 to-blue-200" />
              <div className="space-y-3 overflow-x-auto pb-1">
                {SEAT_ROWS.map((row) => (
                  <div key={row} className="flex min-w-[620px] items-center gap-3">
                    <span className="w-6 text-sm font-bold text-slate-500">{row}</span>
                    <div className="grid flex-1 grid-cols-10 gap-2.5">
                      {SEAT_COLUMNS.map((col) => {
                        const seatCode = `${row}${col}`;
                        const isSelected = selectedSeats.includes(seatCode);

                        return (
                          <button
                            key={seatCode}
                            type="button"
                            onClick={() => toggleSeat(seatCode)}
                            className={`rounded-md py-1 text-xs font-semibold transition ${
                              isSelected
                                ? 'h-11 border border-blue-300 bg-blue-500 text-sm font-bold text-white shadow shadow-blue-200/60'
                                : 'h-11 border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700'
                            }`}
                          >
                            {col}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-slate-600">
                Ghe da chon: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Chua chon'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleConfirmSeats}
                className="flex-1 rounded-lg border border-blue-300 bg-blue-50 py-2 font-semibold text-blue-700 transition hover:bg-blue-500 hover:text-white"
              >
                Xac nhan {selectedSeats.length || 0} ve
              </button>
              <button
                onClick={closeProductDetail}
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
