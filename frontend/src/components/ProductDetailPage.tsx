import React, { useState, useRef, useEffect } from "react";
import { Product } from "../types";
import ProductCard from "./ProductCard";
import ImageGallery from "./ImageGallery";            // Our upgraded component
import ReviewSystem from "./ReviewSystem";            // New
import VideoGallery from "./VideoGallery";            // New
import {
  StarIcon, HeartIcon, ShoppingCartIcon,
  ShieldCheckIcon, CheckIcon, TruckIcon
} from "./icons";
import { shareProductViaWhatsApp } from "../utils/whatsapp";


interface Props {
  product: Product;
  allProducts: Product[];
  wishlist: number[];
  onToggleWishlist: (id:number)=>void;
  onAddToCart: (product: Product, qty:number)=>void;
}


const ProductDetailPage = ({ product, allProducts, wishlist, onToggleWishlist, onAddToCart }: Props) => {

  /** 🔥 Get all product images: Firebase → Local → Placeholder */
  const baseImages =
    (product as any).images?.length > 0 ? (product as any).images :
    product.imageUrls?.length > 0 ? product.imageUrls :
    [];

  /** Convert to Firestore style if array */
  const galleryImages = Array.isArray(baseImages) ? { default: baseImages } : baseImages;

  const video = (product as any).videoUrl || null;


  // ========================= STATE =========================
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]);
  const [quantity,setQuantity] = useState(50);
  const isWishlisted = wishlist.includes(product.id);


  // ========================= SWIPE SUPPORT =========================
  // Swipe handled inside ImageGallery


  // ========================= AUTO-SLIDER (handled inside ImageGallery now) =========================


  // Zoom handled inside ImageGallery





  // ========================= RELATED PRODUCTS =========================
  const related = allProducts.filter(p=>p.category===product.category && p.id!==product.id).slice(0,3);


  const savePct=Math.round(((product.originalPrice-product.price)/product.originalPrice)*100);



  return(
  <div className="bg-slate-50 pb-20">

    {/* Breadcrumb */}
    <div className="mb-4 text-sm text-gray-600">
      <a href="#/">Home</a> / <a href={`#/category/${product.category}`}>{product.category}</a> /
      <b className="text-gray-900"> {product.name}</b>
    </div>

    <div className="bg-white p-8 rounded shadow border">

      <div className="grid lg:grid-cols-2 gap-10">


        {/* ================= LEFT PANEL - IMAGES ================ */}
        <div className="relative">

          {/* Main Component */}
          {/* Normalize image URLs and pass SKU for better fallbacks */}
          {
            (() => {
              const imgsArr: string[] = Array.isArray(baseImages) ? baseImages : [];
              const normalized = imgsArr.map(u => {
                if (!u) return '';
                if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('/')) return u;
                return u.startsWith('images/') ? `/${u}` : `/${u}`;
              });
              return <ImageGallery images={normalized} sku={product.sku} autoPlay delay={3500} />;
            })()
          }

          {/* Zoom handled inside ImageGallery */}

          {video && <VideoGallery videoUrl={video} />}
        </div>



        {/* ================= RIGHT PANEL ================= */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          <div className="flex gap-4 my-3">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 flex gap-2 items-center">
              <StarIcon className="w-5"/> {product.rating}
            </span>

            <span className={`px-3 py-1 rounded-full text-sm font-semibold 
              ${product.inStock?'bg-green-100 text-green-700':'bg-red-200 text-red-700'}`}>
              {product.inStock?"In Stock":"Out of Stock"}
            </span>
          </div>

          <p className="text-gray-600 mb-4">{product.description}</p>

          <div className="bg-slate-50 p-4 rounded-lg border mb-6">
            <p className="text-lg text-gray-600">
              M.R.P: <span className="line-through">₹{product.originalPrice}</span>
              <span className="ml-3 px-2 py-1 text-sm font-bold bg-red-200 text-red-700 rounded">
                SAVE {savePct}%
              </span>
            </p>
            <p className="text-4xl font-extrabold">₹{product.price}</p>
            <p className="text-gray-500 text-sm">(Inclusive of all taxes)</p>
          </div>


          {/* Sizes */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Select Size</h3>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map(s=>(
                <button key={s} onClick={()=>setSelectedSize(s)}
                  className={`px-4 py-2 rounded-full border
                  ${selectedSize===s?"bg-brand-teal-500 text-white border-brand-teal-500":"hover:bg-brand-teal-50"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>


          <div className="flex gap-3 mb-6 items-center">

            <input type="number" min={50} value={quantity}
              onChange={e=>setQuantity(Math.max(50,Number(e.target.value)))}
              aria-label={`Quantity for ${product.name}`}
              title={`Quantity for ${product.name}`}
              className="w-24 p-3 border rounded text-center font-semibold text-lg"/>

            <button onClick={()=>onAddToCart(product,quantity)}
              title="Add to cart"
              aria-label="Add to cart"
              className="flex-1 flex justify-center items-center gap-2 bg-brand-teal-500 hover:bg-brand-teal-600 text-white py-3 rounded-lg font-bold shadow-md transition">
              <ShoppingCartIcon className="w-5"/> Add to Cart
            </button>

            <div className="flex items-center gap-2">
              <button onClick={()=>onToggleWishlist(product.id)}
                title="Toggle wishlist"
                aria-label="Toggle wishlist"
                className="p-3 rounded-lg border hover:bg-red-100">
                <HeartIcon className="w-6 h-6" filled={isWishlisted}/>
              </button>

              <button 
                onClick={() => shareProductViaWhatsApp(product.name, `${window.location.origin}#/product/${product.id}`, product.price)}
                title="Share on WhatsApp"
                aria-label="Share on WhatsApp"
                className="px-3 py-3 rounded-lg hover:opacity-80 transition-opacity flex items-center gap-1">
                <img 
                  src="/logos/whatsapp-official.png" 
                  alt="Share on WhatsApp" 
                  className="w-5 h-5"
                />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>



    {/* ================= PRODUCT DETAILS SECTION ================= */}
    <div className="grid md:grid-cols-3 gap-10 mt-14">

      <div className="md:col-span-2 bg-white p-8 border rounded shadow">

        <h2 className="text-2xl font-bold mb-6">Specifications</h2>
        <dl className="grid grid-cols-2 text-sm gap-y-3 gap-x-6">
          <dt className="text-gray-700 font-medium">SKU</dt>
          <dd className="text-gray-600">{product.sku}</dd>
          <dt className="text-gray-700 font-medium">Material</dt>
          <dd className="text-gray-600">{product.material}</dd>
          <dt className="text-gray-700 font-medium">Sizes</dt>
          <dd className="text-gray-600">{product.sizes.join(", ")}</dd>
          <dt className="text-gray-700 font-medium">MOQ</dt>
          <dd className="text-gray-600">{product.moq} pcs</dd>
          <dt className="text-gray-700 font-medium">Certifications</dt>
          <dd className="text-gray-600">{product.certifications.join(", ")}</dd>
        </dl>

        <div className="mt-6">
          <h3 className="font-semibold text-lg">Key Features</h3>
          <ul className="list-disc ml-5 mt-2">
            {product.features.map((f,i)=>(
              <li key={i} className="py-1">{f}</li>
            ))}
          </ul>
        </div>

        {/* ⭐⭐ Reviews System */}
        <ReviewSystem productId={product.id}/>
      </div>


      <div className="bg-white p-6 border rounded shadow space-y-4">
        <div className="flex gap-3 items-center">
          <TruckIcon className="w-7 text-brand-teal-500"/>
          <p>🚚 Fast Pan-India Delivery</p>
        </div>
        <div className="flex gap-3 items-center">
          <ShieldCheckIcon className="w-7 text-brand-teal-500"/>
          <p>🛡 100% Genuine Products</p>
        </div>
      </div>
    </div>



    {/* Related */}
    {related.length>0 &&(
      <div className="mt-14">
        <h2 className="text-2xl font-bold text-center mb-6">You May Also Like</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {related.map(p=>(
            <ProductCard key={p.id} product={p}
              isWishlisted={wishlist.includes(p.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}/>
          ))}
        </div>
      </div>
    )}

  </div>
  );
};

export default ProductDetailPage;