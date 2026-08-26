// src/App.tsx
import React, { useState, useEffect, useCallback, Suspense, lazy } from "react";

// ⬇️ Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import FloatingWhatsAppButton from "./components/FloatingWhatsAppButton";
import HomePage from "./components/HomePage";
const LoginPage = lazy(() => import("./components/LoginPage"));
const ProductDetailPage = lazy(() => import("./components/ProductDetailPage"));
const ProductListingPage = lazy(() => import("./components/ProductListingPage"));
const AboutPage = lazy(() => import("./components/AboutPage"));
const ContactPage = lazy(() => import("./components/ContactPage"));
const DealerPage = lazy(() => import("./components/DealerPage"));
const WishlistPage = lazy(() => import("./components/WishlistPage"));
const CartPage = lazy(() => import("./components/CartPage"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./components/TermsAndConditions"));
const ContactInformation = lazy(() => import("./components/ContactInformation"));
import Toast from "./components/Toast";
import PageTransition from "./components/PageTransition";
import SkeletonCard from "./components/SkeletonCard";

// ⬇️ Admin Panel (lazy-load admin bundle)
const AdminApp = lazy(() => import("./admin/AdminApp"));
import AuthGuard from "./utils/AuthGuard";

// ⬇️ Services & Types
import api from "./services/api";
import { resolveImagePaths } from "./services/storage";
import { addDNSPrefetch, preloadImages } from "./utils/imageOptimization";
import type { Product, FiltersState, CartItem } from "./types";
import { INITIAL_FILTERS } from "./constants";

const App: React.FC = () => {
  // 🟦 STATE VARIABLES
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FiltersState>(INITIAL_FILTERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlist, setWishlist] = useState<number[]>(() =>
    JSON.parse(localStorage.getItem("wishlist") || "[]")
  );
  const [cart, setCart] = useState<CartItem[]>(() =>
    JSON.parse(localStorage.getItem("cart") || "[]")
  );
  const [sortOption, setSortOption] = useState("featured");
  const [currentPath, setCurrentPath] = useState(window.location.hash || "#/");
  const [renderError, setRenderError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "info" | "error" | "warning";
  } | null>(null);

  // 🟥 SAFETY CHECK — products must always be an array
  if (!Array.isArray(products)) {
    console.error("products corrupted, resetting...", products);
    return <div style={{ padding: 40 }}>Loading…</div>;
  }

  // 🟧 DNS PREFETCH AND PERFORMANCE SETUP
  useEffect(() => {
    addDNSPrefetch();
  }, []);

  // 🟧 FETCH PRODUCTS
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await api.getProducts();
        const list = Array.isArray(response?.products)
          ? response.products
          : [];

        // Resolve any Storage paths to usable download URLs (client-side fallback)
        const withResolvedImages = await Promise.all(
          list.map(async (p: any) => {
            // If server returned `images` as either an array or an object of arrays, flatten and keep them
            if (p.images) {
              if (Array.isArray(p.images) && p.images.length) {
                p.imageUrls = p.images;
                return p;
              }
              if (typeof p.images === 'object') {
                const flattened = Object.values(p.images).flat().filter(Boolean);
                if (flattened.length) {
                  p.imageUrls = flattened;
                  return p;
                }
              }
            }

            // If product stores storage paths in `imagePaths`, resolve them
            if (Array.isArray(p.imagePaths) && p.imagePaths.length) {
              p.imageUrls = await resolveImagePaths(p.imagePaths);
              return p;
            }

            // If product has `imageUrls` (may be storage paths or URLs), resolve them
            if (Array.isArray(p.imageUrls) && p.imageUrls.length) {
              p.imageUrls = await resolveImagePaths(p.imageUrls);
              return p;
            }

            // fallback: try to construct from sku convention (kept existing behaviour)
            return p;
          })
        );

        setProducts(withResolvedImages);
        
        // Preload first 6 product images for fast display
        const firstBatch = withResolvedImages.slice(0, 6);
        const imageUrls = firstBatch
          .flatMap(p => Array.isArray(p.imageUrls) ? p.imageUrls : [])
          .filter(url => url && url.startsWith('http'));
        
        if (imageUrls.length > 0) {
          preloadImages(imageUrls).catch(() => {
            // Preload failed, but don't block UI
          });
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        try {
          const fallback = await fetch("/products.json");
          const json = await fallback.json();
          setProducts(Array.isArray(json) ? json : []);
        } catch {
          setProducts([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  // 🟩 SAVE WISHLIST + CART
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 🟦 HASH ROUTER LISTENER
  useEffect(() => {
    const handler = () => setCurrentPath(window.location.hash || "#/");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  // 🟨 TOAST
  const showToast = (
    msg: string,
    type: "success" | "info" | "error" | "warning" = "success"
  ) => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ❤️ WISHLIST
  const handleToggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  // 🛒 CART
  const handleAddToCart = (product: Product, qty: number) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.product.id === product.id);

      if (exists) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }

      return [...prev, { product, quantity: qty }];
    });
    showToast("Added to cart!", "success");
  };

  const handleUpdateCartQuantity = (id: number, qty: number) => {
    if (qty <= 0) return handleRemoveFromCart(id);
    setCart((prev) =>
      prev.map((i) =>
        i.product.id === id ? { ...i, quantity: qty } : i
      )
    );
  };

  const handleRemoveFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.product.id !== id));
  };

  const handleRemoveActiveFilter = (key: keyof FiltersState | 'search', value?: any) => {
    console.log('Removing filter:', key, value);
    try {
      if (key === 'search') {
        setSearchQuery('');
      } else if (key === 'priceRange') {
        setFilters(prev => ({ ...prev, priceRange: INITIAL_FILTERS.priceRange }));
      } else if (key === 'categories' || key === 'sizes' || key === 'certifications') {
        setFilters(prev => ({
          ...prev,
          [key]: (prev[key] as string[]).filter(v => v !== value)
        }));
      } else if (key === 'availability') {
        setFilters(prev => ({ ...prev, availability: 'all' }));
      }
    } catch (err) {
      console.error('Error removing filter:', err);
    }
  };

  // ⭐ FILTERING LOGIC
  const applyFiltersAndSort = useCallback(() => {
    let temp = [...(products || [])];

    const q = searchQuery.toLowerCase();
    if (q.length > 1) {
      temp = temp.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (currentPath.startsWith("#/category/")) {
      const slug = currentPath.split("/")[2];
      // Restore category name from slug
      // "lumbar-and-back-support" → "Lumbar & Back Support"
      const words = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1));
      const restored = words.join(' ');
      const catName = restored.replace(/\s+and\s+/gi, ' & ');
      console.log('Category filter debug:', { slug, restored, catName, matchFound: temp.find(p => p.category === catName) });
      temp = temp.filter((p) => p.category === catName);
    }

    if ((filters?.categories ?? []).length) {
      temp = temp.filter((p) =>
        (filters.categories ?? []).includes(p.category)
      );
    }

    const priceRange = filters?.priceRange ?? [0, 2000];
    temp = temp.filter(
      (p) =>
        p.price >= priceRange[0] &&
        p.price <= priceRange[1]
    );

    if ((filters?.sizes ?? []).length) {
      temp = temp.filter((p) =>
        (filters.sizes ?? []).some(s => p.sizes && p.sizes.includes(s))
      );
    }

    if ((filters?.certifications ?? []).length) {
      temp = temp.filter((p) =>
        (filters.certifications ?? []).some(c => p.certifications && p.certifications.includes(c))
      );
    }

    if ((filters?.availability ?? 'all') === 'inStock') {
      temp = temp.filter((p) => p.inStock);
    } else if ((filters?.availability ?? 'all') === 'bulk') {
      temp = temp.filter((p) => p.bulkAvailable);
    }

    switch (sortOption) {
      case "price-asc":
        temp.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        temp.sort((a, b) => b.price - a.price);
        break;
      default:
        temp.sort((a, b) => a.id - b.id);
    }

    setFilteredProducts(temp);
  }, [products, filters, searchQuery, sortOption, currentPath]);

  useEffect(() => applyFiltersAndSort(), [applyFiltersAndSort]);

  // ⭐ FILTER CHANGE HANDLER - merges partial updates with existing filters
  const handleFilterChange = (newFilters: Partial<FiltersState>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  // 🧭 HASH ROUTER PAGES
  const renderPage = () => {
    if (currentPath.startsWith("#/admin"))
      return (
        <Suspense fallback={<div>Loading admin…</div>}>
          <AuthGuard>
            <AdminApp />
          </AuthGuard>
        </Suspense>
      );

    if (currentPath.startsWith("#/product/")) {
      const id = currentPath.split("/")[2];
      const product = products.find((p) => String(p.id) === String(id));

      return product ? (
        <Suspense fallback={<div>Loading product…</div>}>
          <ProductDetailPage
            product={product}
            allProducts={products}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
          />
        </Suspense>
      ) : (
        <p>Product not found</p>
      );
    }

    if (currentPath === "#/login")
      return (
        <Suspense fallback={<div>Loading…</div>}>
          <LoginPage />
        </Suspense>
      );
    if (currentPath === "#/about")
      return (
        <Suspense fallback={<div>Loading…</div>}>
          <AboutPage />
        </Suspense>
      );
    if (currentPath === "#/contact")
      return (
        <Suspense fallback={<div>Loading…</div>}>
          <ContactPage />
        </Suspense>
      );
    if (currentPath === "#/dealer")
      return (
        <Suspense fallback={<div>Loading…</div>}>
          <DealerPage />
        </Suspense>
      );

    if (currentPath === "#/privacy")
      return (
        <Suspense fallback={<div>Loading…</div>}>
          <PrivacyPolicy />
        </Suspense>
      );

    if (currentPath === "#/terms")
      return (
        <Suspense fallback={<div>Loading…</div>}>
          <TermsAndConditions />
        </Suspense>
      );

    if (currentPath === "#/contact-info")
      return (
        <Suspense fallback={<div>Loading…</div>}>
          <ContactInformation />
        </Suspense>
      );

    if (currentPath === "#/wishlist")
      return (
        <Suspense fallback={<div>Loading…</div>}>
          <WishlistPage
            wishlist={wishlist}
            allProducts={products}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
          />
        </Suspense>
      );

    if (currentPath === "#/cart")
      return (
        <Suspense fallback={<div>Loading…</div>}>
          <CartPage
            cartItems={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
          />
        </Suspense>
      );

    // Show HomePage for root path
    if (currentPath === "#/") {
      return (
        <HomePage
          products={products}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
        />
      );
    }

    return (
      <Suspense 
        key="product-listing"
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        }
      >
        <ProductListingPage
          products={filteredProducts}
          filters={filters}
          searchQuery={searchQuery}
          onFilterChange={handleFilterChange}
          onClearFilters={() => setFilters(INITIAL_FILTERS)}
          onRemoveActiveFilter={handleRemoveActiveFilter}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
          sortOption={sortOption}
          onSortChange={setSortOption}
          pageTitle="All Products"
        />
      </Suspense>
    );
  };

  // ⭐ JSX RENDER
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
      <Header
        products={products}
        wishlistCount={wishlist.length}
        cartCount={cart.reduce((n, i) => n + i.quantity, 0)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        {renderError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h3 className="text-red-800 font-semibold">Error Loading Page</h3>
            <p className="text-red-700 text-sm">{renderError}</p>
            <button 
              onClick={() => { setRenderError(null); window.location.hash = '#/'; }} 
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Return to Home
            </button>
          </div>
        )}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <PageTransition>
            {(() => {
              try {
                const page = renderPage();
                if (!page) {
                  return <div className="text-center py-8 text-gray-600">Unable to load page</div>;
                }
                return page;
              } catch (err) {
                const errMsg = err instanceof Error ? err.message : String(err);
                console.error("Page rendering error:", err);
                setRenderError(errMsg);
                return (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-red-800 font-semibold">Error Loading Page</h3>
                    <p className="text-red-700 text-sm">{errMsg}</p>
                    <button 
                      onClick={() => { setRenderError(null); window.location.hash = '#/'; }} 
                      className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Return to Home
                    </button>
                  </div>
                );
              }
            })()}
          </PageTransition>
        )}
      </main>

      <Footer />

      <Toast
        message={toast?.message}
        type={toast?.type}
        isVisible={!!toast}
      />

      <FloatingWhatsAppButton />
    </div>
  );
};

export default App;