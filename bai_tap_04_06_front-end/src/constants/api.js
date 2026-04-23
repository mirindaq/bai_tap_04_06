const stripTrailingSlash = (value) => value.replace(/\/+$/, '');

export const API_BASE_URL = stripTrailingSlash(
  import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:8088'
);

export const AUTH_API_PREFIX = '/api-gateway/customer-service/api/v1/auth';
export const PRODUCT_API_PREFIX = '/api-gateway/product-service/products';
export const ORDER_API_PREFIX = '/api-gateway/order-service/orders';
