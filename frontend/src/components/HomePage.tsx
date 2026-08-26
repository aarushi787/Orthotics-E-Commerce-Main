import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { CATEGORIES } from '../constants';

interface HomePageProps {
  products: Product[];
  wishlist: number[];
  onToggleWishlist: (id: number) => void;
  onAddToCart: (product: Product, qty: number) => void;
}

const HomePage: React.FC<HomePageProps> = ({
  products,
  wishlist,
  onToggleWishlist,
  onAddToCart,
}) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [topRatedProducts, setTopRatedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    // Get featured products (first 8 with discount)
    const featured = products
      .filter((p) => p.originalPrice && p.originalPrice > p.price)
      .slice(0, 8);
    setFeaturedProducts(featured);

    // Get top rated products
    const topRated = products
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 4);
    setTopRatedProducts(topRated);

    // Use predefined categories with correct counts
    setCategories(CATEGORIES.map(cat => ({ ...cat, icon: '🏥' })));
  }, [products]);

  const slugify = (text: string) =>
    text.toLowerCase().replace(/ & /g, '-and-').replace(/\s+/g, '-');

  const resolveImg = (u?: string) => {
    if (!u) return '/images/no-image.png';
    if (/^(https?:)?\/\//.test(u) || u.startsWith('/')) return u;
    return `/${u}`;
  };

  const ProductPreview = ({ product }: { product: Product }) => {
    const discount = product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;
    const isWishlisted = wishlist.includes(product.id);

    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 p-3 flex flex-col h-full">
        <div className="relative mb-2 flex items-center justify-center bg-gray-50 rounded overflow-hidden" style={{minHeight:280}}>
          <a href={`#/product/${product.id}`} className="block w-full h-full flex items-center justify-center">
            <img
              src={resolveImg(product.imageUrls?.[0])}
              alt={product.name}
              className="max-h-[160px] md:max-h-[220px] lg:max-h-[260px] mx-auto object-contain"
              onError={(e)=>{
                const img = e.currentTarget as HTMLImageElement;
                if (img.dataset.attempt === '1') { img.src = '/images/no-image.png'; return; }
                const s = (product.sku || '').toString().toUpperCase();
                if (s) { img.dataset.attempt = '1'; img.src = `/images/${s}/${s}-1.jpg`; return; }
                img.src = '/images/no-image.png';
              }}
            />
          </a>
          {discount > 5 && (
            <span className="absolute top-1 left-1 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
              {discount}% OFF
            </span>
          )}
          <button
            onClick={() => onToggleWishlist(product.id)}
            className="absolute top-1 right-1 bg-white/80 p-1 rounded-full hover:bg-red-50"
          >
            <span className="text-lg">{isWishlisted ? '❤️' : '🤍'}</span>
          </button>
        </div>
        <a href={`#/product/${product.id}`} className="font-semibold text-sm hover:text-brand-teal-500 line-clamp-2">
          {product.name}
        </a>
        <div className="flex items-center gap-1 my-1">
          <span className="text-xs bg-amber-300 text-white px-1.5 py-0.5 rounded">⭐ {product.rating || 0}</span>
          <span className="text-xs text-gray-500">{product.moq} MOQ</span>
        </div>
        <div className="flex items-center gap-2 mt-auto mb-2">
          <span className="text-lg font-bold text-brand-teal-500">₹{product.price}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs line-through text-gray-400">₹{product.originalPrice}</span>
          )}
        </div>
        <button
          onClick={() => onAddToCart(product, 50)}
                className="w-full bg-brand-teal-500 hover:bg-brand-teal-600 text-white py-2 rounded text-sm font-semibold shadow-sm hover:shadow-md transition"
        >
          Add to Cart
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white">
      {/* ============ HERO SLIDER WITH POSTERS ============ */}
      {/* Inline slider component to keep file self-contained */}
      {/* <HeroSliderInternal /> */}
      <div className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <a href="#/products" className="relative rounded-xl overflow-hidden shadow-lg block hover:shadow-2xl transition-shadow">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/e-commerce-61d74.firebasestorage.app/o/images%2FSlider-poster.jpg?alt=media&token=46783c41-53a6-4f6a-a052-4d42768c0ae2"
              alt="Combo Deals"
              className="w-full h-auto object-cover max-h-96 hover:opacity-95 transition-opacity"
            />
          </a>
        </div>
      </div>

      {/* ============ CATEGORIES GRID ============ */}
      <div className="bg-brand-teal-50 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-brand-teal-700">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <a
                key={cat.name}
                href={`#/category/${slugify(cat.name)}`}
                className="bg-white rounded-lg p-8 text-center hover:shadow-lg hover:scale-105 transition-all hover:border-2 hover:border-brand-teal-500"
              >
                <div className="text-5xl md:text-6xl mb-4">{cat.icon}</div>
                <h3 className="font-semibold text-sm md:text-base line-clamp-2">{cat.name}</h3>
                <p className="text-xs text-gray-500 mt-2">{cat.count} products</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ============ COMBO DEAL POSTER ============ */}
      <div className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <a href="#/products" className="relative rounded-xl overflow-hidden shadow-lg block hover:shadow-2xl transition-shadow">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/e-commerce-61d74.firebasestorage.app/o/images%2FCombo.jpg?alt=media&token=85c7909a-0220-4bb5-afd2-ac5d5a795316"
              alt="Combo Deals"
              className="w-full h-auto object-cover max-h-96 hover:opacity-95 transition-opacity"
            />
          </a>
        </div>
      </div>

      {/* ============ FEATURED DEALS ============ */}
      <div className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-teal-700">🔥 Featured Deals</h2>
            <a href="#/products" className="text-brand-teal-500 hover:text-brand-teal-700 font-semibold">
              View All →
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id}>
                <ProductPreview product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ DEAL POSTER ============ */}
      <div className="py-8 md:py-12 bg-brand-teal-50">
        <div className="container mx-auto px-4">
          <a href="#/products" className="relative rounded-xl overflow-hidden shadow-lg block hover:shadow-2xl transition-shadow">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/e-commerce-61d74.firebasestorage.app/o/images%2FDeal.jpg?alt=media&token=dc068c91-f6c1-44db-9854-6522895f6686"
              alt="Special Deals"
              className="w-full h-auto object-cover max-h-96 hover:opacity-95 transition-opacity"
            />
          </a>
        </div>
      </div>

      {/* ============ TOP RATED PRODUCTS ============ */}
      <div className="py-12 md:py-16 bg-brand-teal-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-teal-700">⭐ Top Rated Products</h2>
            <a href="#/products" className="text-brand-teal-500 hover:text-brand-teal-700 font-semibold">
              View All →
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {topRatedProducts.map((product) => (
              <div key={product.id}>
                <ProductPreview product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ INFO CARDS ============ */}
      <div className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-brand-teal-50 p-6 rounded-lg text-center hover:shadow-lg transition">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-bold mb-2 text-brand-teal-700">100% Genuine</h3>
              <p className="text-sm text-gray-600">Authentic medical-grade products</p>
            </div>
            <div className="bg-brand-teal-50 p-6 rounded-lg text-center hover:shadow-lg transition">
              <div className="text-4xl mb-3">🚚</div>
              <h3 className="font-bold mb-2 text-brand-teal-700">Fast Delivery</h3>
              <p className="text-sm text-gray-600">Pan-India shipping available</p>
            </div>
            <div className="bg-brand-teal-50 p-6 rounded-lg text-center hover:shadow-lg transition">
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="font-bold mb-2 text-brand-teal-700">Secure Payment</h3>
              <p className="text-sm text-gray-600">Safe and encrypted transactions</p>
            </div>
            <div className="bg-brand-teal-50 p-6 rounded-lg text-center hover:shadow-lg transition">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-bold mb-2 text-brand-teal-700">Best Prices</h3>
              <p className="text-sm text-gray-600">Competitive rates guaranteed</p>
            </div>
          </div>
        </div>
      </div>

      {/* ============ TESTIMONIALS ============ */}
      <div className="bg-brand-teal-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-brand-teal-700">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Priya Sharma',
                role: 'Verified Buyer',
                text: 'Excellent quality products and fast delivery. Highly recommended!',
                rating: 5,
              },
              {
                name: 'Rajesh Kumar',
                role: 'Medical Professional',
                text: 'Great range of orthopedic solutions. Perfect for my clinic.',
                rating: 5,
              },
              {
                name: 'Anita Patel',
                role: 'Verified Buyer',
                text: 'Best prices compared to other retailers. Will order again!',
                rating: 4.5,
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-l-4 border-brand-teal-500">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-brand-teal-500">
                      {j < Math.floor(testimonial.rating) ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                <div className="font-semibold text-brand-teal-700">{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ CTA SECTION ============ */}
      <div className="bg-gradient-to-r from-[#308495] to-[#04BFBF] text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Thousands of Satisfied Customers</h2>
          <p className="text-lg mb-8 opacity-90">Start shopping for premium orthopedic solutions today</p>
          <a
            href="#/products"
            className="inline-block bg-white text-brand-teal-500 px-8 py-3 rounded-lg font-bold hover:bg-brand-teal-50 transition"
          >
            Start Shopping
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
