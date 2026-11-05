import { products as fallbackProducts, categories as fallbackCategories } from '../data/products';
import { reviews as fallbackReviews, reviewStats as fallbackReviewStats } from '../data/reviews';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Fetch products with optional query filters (category, isBestSeller, isTrending, search)
 */
export async function getProducts(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.isBestSeller) params.append('isBestSeller', 'true');
    if (filters.isTrending) params.append('isTrending', 'true');
    if (filters.search) params.append('search', filters.search);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/products${query}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.warn('API fetch products failed, falling back to local dataset:', error.message);
    let list = [...fallbackProducts];
    if (filters.category) list = list.filter(p => p.category === filters.category);
    if (filters.isBestSeller) list = list.filter(p => p.isBestSeller);
    if (filters.isTrending) list = list.filter(p => p.isTrending);
    return list;
  }
}

/**
 * Fetch single product by ID
 */
export async function getProductById(id) {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.warn('API fetch product failed, falling back to local dataset:', error.message);
    return fallbackProducts.find(p => p.id === id) || null;
  }
}

/**
 * Fetch all categories
 */
export async function getCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.warn('API fetch categories failed, falling back to local dataset:', error.message);
    return fallbackCategories;
  }
}

/**
 * Fetch all customer reviews and rating statistics
 */
export async function getReviews() {
  try {
    const res = await fetch(`${API_BASE}/reviews`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return {
      reviews: data.data,
      stats: data.stats
    };
  } catch (error) {
    console.warn('API fetch reviews failed, falling back to local dataset:', error.message);
    return {
      reviews: fallbackReviews,
      stats: fallbackReviewStats
    };
  }
}

/**
 * Submit a new customer review
 */
export async function submitReview(reviewData) {
  try {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('API submit review failed:', error.message);
    throw error;
  }
}

/**
 * Vote helpful or unhelpful on a review
 */
export async function voteReview(id, type) {
  try {
    const res = await fetch(`${API_BASE}/reviews/${id}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type })
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('API vote review failed:', error.message);
    throw error;
  }
}

/**
 * Submit checkout order
 */
export async function createOrder(orderPayload) {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('API create order failed:', error.message);
    throw error;
  }
}

/**
 * Fetch an order by order number or ID
 */
export async function getOrder(orderId) {
  try {
    const res = await fetch(`${API_BASE}/orders/${orderId}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('API get order failed:', error.message);
    throw error;
  }
}

/**
 * Subscribe to the Silk Club newsletter
 */
export async function subscribeNewsletter(email) {
  try {
    const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn('API subscribe failed, falling back to local simulation:', error.message);
    return {
      success: true,
      couponCode: 'SILK15',
      message: 'Welcome to Silk Club!'
    };
  }
}
