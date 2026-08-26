import React from 'react';
import { Product } from '../types';

interface SearchSuggestionsProps {
  suggestions: Product[];
  onSuggestionClick: (product: Product) => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ suggestions, onSuggestionClick }) => {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-80 overflow-y-auto">
      <ul>
        {suggestions.map(product => (
          <li key={product.id}>
            <button
              onClick={() => onSuggestionClick(product)}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors flex items-center gap-4"
            >
              <img
                src={
                  (product.imageUrls && product.imageUrls[0]
                    ? (product.imageUrls[0].startsWith('/') ? product.imageUrls[0] : `/${product.imageUrls[0]}`)
                    : '/images/no-image.png')
                }
                alt={product.name}
                className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  if (img.dataset.attempt === '1') {
                    img.src = '/images/no-image.png';
                    return;
                  }
                  const s = (product.sku || '').toString().toUpperCase();
                  if (s) {
                    img.dataset.attempt = '1';
                    img.src = `/images/${s}/${s}-1.jpg`;
                    return;
                  }
                  img.src = '/images/no-image.png';
                }}
              />
              <div>
                <p className="font-semibold text-gray-800 text-sm">{product.name}</p>
                <p className="text-xs text-gray-500">{product.category}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchSuggestions;
