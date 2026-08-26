import React, { useState, useEffect } from 'react';
import {
    AIIcon,
    PhoneIcon,
    MailIcon,
    LocationMarkerIcon,
    SearchIcon,
    UserIcon,
    ShoppingCartIcon,
    HeartIcon
} from './icons';
import { CATEGORIES } from '../constants';
import { Product } from '../types';
import SearchSuggestions from './SearchSuggestions';
import { openBusinessWhatsApp } from '../utils/whatsapp';

// Logo asset path resolved at build time
const logo = new URL('../assets/logo.png', import.meta.url).href;

interface HeaderProps {
    products: Product[];
    wishlistCount: number;
    cartCount: number;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const slugify = (text: string) =>
    text.toLowerCase().replace(/ & /g, '-and-').replace(/\s+/g, '-');

const Header: React.FC<HeaderProps> = ({
    products,
    wishlistCount,
    cartCount,
    searchQuery,
    setSearchQuery
}) => {

    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (searchQuery.length > 1) {
            const q = searchQuery.toLowerCase();
            const filtered = products
                .filter(
                    (p) =>
                        p.name.toLowerCase().includes(q) ||
                        p.sku.toLowerCase().includes(q) ||
                        p.category.toLowerCase().includes(q)
                )
                .slice(0, 8);

            setSuggestions(filtered);
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [searchQuery, products]);

    return (
        <header className="bg-white shadow-md sticky top-0 z-30">
            {/* ---------- TOP BAR ---------- */}
            <div className="bg-gray-100 text-gray-600 text-xs py-2">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <a href="tel:+917011770526" className="flex items-center gap-1 hover:text-brand-teal-500">
                            <PhoneIcon className="w-4 h-4" />
                            <span>+91 70117 70526</span>
                        </a>

                        <a href="mailto:info@foxorthotics.com" className="flex items-center gap-1 hover:text-brand-teal-500">
                            <MailIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">info@foxorthotics.com</span>
                        </a>

                        <div className="hidden md:flex items-center gap-1">
                            <LocationMarkerIcon className="w-4 h-4" />
                            <span>North Ghonda, Delhi</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                            GST REGISTERED
                        </div>
                        <button 
                            onClick={() => openBusinessWhatsApp("Hi! I'd like to inquire about your products.")}
                            className="hidden sm:flex items-center gap-2 hover:opacity-90 transition-opacity"
                            title="Chat on WhatsApp"
                        >
                            <img 
                                src="/logos/whatsapp-official.png" 
                                alt="WhatsApp" 
                                className="w-6 h-6 rounded-full"
                            />
                            <span className="text-xs font-semibold text-gray-700">WhatsApp</span>
                        </button>
                        <a href="#/dealer" className="hover:text-brand-teal-500 font-medium">
                            Become a Dealer
                        </a>
                    </div>
                </div>
            </div>

            {/* ---------- MAIN HEADER ---------- */}
            <div className="bg-brand-teal-500">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">

                    {/* ---------- LOGO + BRAND NAME ---------- */}
                    <a href="#/" className="flex items-center gap-3">
                        <div className="bg-brand-teal-600 p-2 rounded-full">
                            <img
                                src={logo}
                                alt="Fox Logo"
                                className="w-10 h-10 md:w-12 md:h-12 object-contain"
                            />
                        </div>

                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-white">Fox</h1>
                            <p className="text-xs md:text-sm text-gray-300">Premium Orthopedic Solutions</p>
                        </div>
                    </a>

                    {/* ---------- SEARCH BAR + AI BUTTON ---------- */}
                    <div className="flex-1 max-w-2xl mx-4 flex items-center gap-2 relative">

                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Search products, categories, SKU..."
                                className="w-full py-2.5 pl-4 pr-12 rounded-md border-gray-300 focus:ring-yellow-400 focus:outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.length > 1 && setIsVisible(true)}
                                onBlur={() => setTimeout(() => setIsVisible(false), 200)}
                            />

                            <button 
                                className="absolute right-0 inset-y-0 bg-brand-teal-600 px-3 rounded-r-md text-white"
                                title="Search products"
                                aria-label="Search"
                            >
                                <SearchIcon className="w-5 h-5" />
                            </button>

                            {isVisible && suggestions.length > 0 && (
                                <SearchSuggestions
                                    suggestions={suggestions}
                                    onSuggestionClick={(p) => {
                                        setSearchQuery(p.name);
                                        setIsVisible(false);
                                        window.location.hash = `#/product/${p.id}`;
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* ---------- ACCOUNT / WISHLIST / CART ---------- */}
                    <div className="flex items-center gap-4 text-white">

                        <a href="#/login" className="hover:text-gray-300 flex items-center flex-col">
                            <UserIcon className="w-6 h-6" />
                            <span className="text-xs hidden sm:inline">Account</span>
                        </a>

                        <a href="#/wishlist" className="relative hover:text-gray-300 flex items-center flex-col">
                            <HeartIcon className="w-6 h-6" />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                                    {wishlistCount}
                                </span>
                            )}
                            <span className="text-xs hidden sm:inline">Wishlist</span>
                        </a>

                        <a href="#/cart" className="relative hover:text-gray-300 flex items-center flex-col">
                            <ShoppingCartIcon className="w-6 h-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                            <span className="text-xs hidden sm:inline">Cart</span>
                        </a>

                    </div>
                </div>
            </div>

            {/* ---------- NAVIGATION BAR ---------- */}
            <nav className="border-b bg-white hidden md:block">
                <div className="container mx-auto px-4 flex items-center gap-1">
                    <a href="#/" className="px-4 py-3 font-semibold hover:bg-brand-teal-50">Home</a>
                    <a href="#/products" className="px-4 py-3 font-semibold bg-brand-teal-50 text-brand-teal-500">All Products</a>

                    {CATEGORIES.slice(0, 5).map((cat) => (
                        <a
                            key={cat.name}
                            href={`#/category/${slugify(cat.name)}`}
                            className="px-4 py-3 hover:bg-brand-teal-50 text-gray-700 font-medium"
                        >
                            {cat.name}
                        </a>
                    ))}

                    <a href="#/dealer" className="ml-auto text-brand-teal-500 font-bold px-4 py-3 hover:bg-brand-teal-50">
                        Bulk Orders
                    </a>
                </div>
            </nav>
        </header>
    );
};

export default Header;