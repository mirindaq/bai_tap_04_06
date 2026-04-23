import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'cartItems';

const readStoredCart = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(readStoredCart);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addItem = (product, quantity = 1) => {
    const safeQty = Number(quantity) > 0 ? Number(quantity) : 1;
    const productId = Number(product?.id);
    if (!productId) {
      return;
    }

    const nextItem = {
      id: productId,
      name: product?.name || `San pham #${productId}`,
      price: Number(product?.price ?? 0),
      image: product?.image || product?.imageUrl || '',
      description: product?.description || '',
      seatNumber: product?.seatNumber || '',
      quantity: safeQty,
    };

    setCartItems((prev) =>
      prev.some((item) => item.id === productId)
        ? prev.map((item) =>
            item.id === productId
              ? {
                  ...item,
                  quantity: item.quantity + safeQty,
                  seatNumber: [item.seatNumber, nextItem.seatNumber].filter(Boolean).join(', '),
                }
              : item,
          )
        : [...prev, nextItem],
    );
  };

  const updateQuantity = (id, quantity) => {
    const nextQuantity = Math.max(1, Number(quantity) || 1);
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: nextQuantity } : item)),
    );
  };

  const changeQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) {
          return item;
        }
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }),
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = useMemo(() => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
      cartItems,
      cartCount: totalItems,
      totalPrice,
      addItem,
      updateQuantity,
      changeQuantity,
      removeItem,
      clearCart,
    };
  }, [cartItems]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
