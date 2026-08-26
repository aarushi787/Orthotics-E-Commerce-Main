import React from 'react';
import { openBusinessWhatsApp } from '../utils/whatsapp';

export default function FloatingWhatsAppButton() {
  return (
    <button
      onClick={() => openBusinessWhatsApp("Hi! I'd like to inquire about your products.")}
      className="fixed bottom-6 right-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 hover:scale-110"
      title="Chat with us on WhatsApp"
      aria-label="Chat with us on WhatsApp"
    >
      <img 
        src="/logos/whatsapp-official.png" 
        alt="WhatsApp" 
        className="w-16 h-16 rounded-full"
      />
    </button>
  );
}
