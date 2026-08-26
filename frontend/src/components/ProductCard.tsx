import React, { useState, useEffect } from "react";
import { Product } from "../types";
import { StarIcon, HeartIcon, ShoppingCartIcon } from "./icons";
import { shareProductViaWhatsApp } from "../utils/whatsapp";
import { resolveImagePath } from "../services/imageLoader";

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: number) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

// Placeholder SVG for faster loading
const PlaceholderSVG = () => (
  <svg className="w-full h-full bg-gray-200" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="400" fill="#f0f0f0"/>
    <path d="M200 180 L250 230 L300 180 L300 300 Q200 350 100 300 L100 180 Z" fill="#d0d0d0" opacity="0.5"/>
  </svg>
);

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [mainImageUrl, setMainImageUrl] = useState<string>("/images/no-image.png");
  
  const {
    id,
    name,
    price,
    originalPrice,
    rating,
    moq,
    imageUrls,
    images,
    inStock,
    category,
    sku,
  } = product;

  // ---------- UNIVERSAL IMAGE PICKER ----------
  // Priority: imageUrls[] → images.default[] → images[color][] → fallback
  const extractedImages: string[] = (
    (images && typeof images === "object" ? Object.values(images).flat() : []) || []
  ).filter((img): img is string => typeof img === 'string');

  const rawImagePath =
    (Array.isArray(imageUrls) && imageUrls.length ? imageUrls[0] : null) ||
    extractedImages[0] ||
    null;

  // Resolve image INSTANTLY on mount (no async wait)
  useEffect(() => {
    if (rawImagePath) {
      // Directly get URL - resolveImagePath is synchronous now
      const url = resolveImagePath(rawImagePath);
      setMainImageUrl(url);
    } else {
      setMainImageUrl("/images/no-image.png");
    }
  }, [rawImagePath]);

  // ---------- PRICE SAFETY ----------
  const p = Number(price) || 0;
  const mrp = Number(originalPrice) || p;
  const discount = mrp > 0 ? Math.round(((mrp - p) / mrp) * 100) : 0;

  const mainImage = mainImageUrl;

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.target as HTMLImageElement;
    // Ensure image becomes visible even on error
    setImageLoaded(true);
    
    // prevent infinite loop — try one SKU-based fallback then final placeholder
    if (img.dataset.attempt === "1") {
      img.src = "/images/no-image.png";
      return;
    }

    // try SKU-based folder convention e.g. /images/MDL-101/MDL-101-1.jpg
    const s = (sku || product.sku || "").toString().toUpperCase();
    if (s) {
      img.dataset.attempt = "1";
      img.src = `/images/${s}/${s}-1.jpg`;
      return;
    }

    img.src = "/images/no-image.png";
  };

  // ---------- RESPONSIVE SRCSET + SIZES ----------
  const sizesAttr = "(min-width:1280px) 375px, (min-width:768px) calc((100vw - 30px)/2), 100vw";

  const buildSrcWithWidth = (url: string, w: number) => {
    try {
      // If url already contains a width param, replace it
      if (url.match(/([?&])width=\d+/)) {
        return url.replace(/([?&])width=\d+/, `$1width=${w}`);
      }

      // If there's already a query string, append with &width=
      if (url.includes("?")) return `${url}&width=${w}`;

      // otherwise add ?width=
      return `${url}?width=${w}`;
    } catch (err) {
      return url;
    }
  };

  const buildSrcSet = (url: string | null) => {
    if (!url || typeof url !== "string") return undefined;

    // Only attempt to generate srcset for absolute or CDN-like URLs
    const candidate = url.startsWith("http") || url.includes("cdn") || url.includes("/cdn/") || url.includes("?v=");
    if (!candidate) return undefined;

    const widths = [360, 533, 720, 940, 1066, 1500];
    const set = widths
      .map((w) => `${buildSrcWithWidth(url, w)} ${w}w`)
      .join(", ");
    return set;
  };

  const srcSet = buildSrcSet(mainImage);

  // ----------------------------------------------
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col group border overflow-hidden">
      {/* PRODUCT IMAGE */}
      <div className="relative bg-gray-50 overflow-hidden h-64 sm:h-80 lg:h-96">
        <a href={`#/product/${id}`}>
          {/* Placeholder shown while loading */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-300 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <img
            src={mainImage}
            srcSet={srcSet}
            sizes={sizesAttr}
            alt={name}
            className={`w-full h-full object-cover bg-white transition-opacity duration-300 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onError={handleImgError}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
            decoding="async"
            crossOrigin="anonymous"
          />
        </a>

        {/* Wishlist */}
        <button
          onClick={() => onToggleWishlist(id)}
          aria-label={`Toggle wishlist for ${name}`}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 bg-white/80 p-2 rounded-full hover:bg-red-50 text-gray-700 hover:text-red-500"
        >
          <HeartIcon filled={isWishlisted} className="w-5 h-5" />
        </button>

        {/* Discount Badge */}
        {discount > 5 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs rounded-md font-semibold">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* PRODUCT INFO */}
      <div className="p-4 flex flex-col flex-grow">
        <a
          href={`#/category/${category
            ?.toLowerCase()
            .replace(/ & /g, "-and-")
            .replace(/\s+/g, "-")}`}
          className="text-xs text-gray-500 font-semibold"
        >
          {category}
        </a>

        <a
          href={`#/product/${id}`}
          className="font-extrabold text-gray-800 mt-1 hover:text-brand-teal-500"
        >
          {name}
        </a>

        {/* Rating + MOQ */}
        <div className="flex justify-between mt-3">
          <div className="flex items-center gap-1 bg-amber-300 text-white px-2 py-0.5 rounded">
            <StarIcon className="w-4 h-4" />
            {rating}
          </div>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            MOQ: {moq}
          </span>
        </div>

        {/* PRICE */}
        <div className="mt-4">
          <p className="text-lg font-bold text-brand-teal-500">₹{p}</p>
          {discount > 5 && (
            <p className="text-xs text-gray-400 line-through">₹{mrp}</p>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-auto flex gap-2 pt-4 border-t">
          <a
            href={`#/product/${id}`}
            className="flex-1 text-center border rounded-lg py-2 hover:bg-gray-100"
          >
            Details
          </a>

          <button
            title="Share on WhatsApp"
            onClick={() => shareProductViaWhatsApp(name, `${window.location.origin}#/product/${id}`, p)}
            className="px-2 py-2 rounded-lg hover:opacity-80 hidden sm:block transition-opacity"
          >
            <img 
              src="/logos/whatsapp-official.png" 
              alt="Share on WhatsApp" 
              className="w-5 h-5"
            />
          </button>

          <button
            disabled={!inStock}
            onClick={() => onAddToCart(product, 50)}
            className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-brand-teal-500 text-white py-2 hover:bg-brand-teal-600 disabled:bg-gray-300 transition"
            title={inStock ? "Add to cart" : "Out of stock"}
          >
            <ShoppingCartIcon className="w-5" /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;