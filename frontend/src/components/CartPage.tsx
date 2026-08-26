import React, { useState } from 'react';
import { CartItem } from '../types';
import { ShoppingCartIcon } from './icons';
import api from '../services/api';

import { RAZORPAY_KEY_ID } from '../constants';

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
}

const CartPage: React.FC<CartPageProps> = ({ cartItems, onUpdateQuantity, onRemoveItem }) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = +(subtotal * 0.05).toFixed(2); // 5% GST
  const total = +(subtotal + tax).toFixed(2);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const MIN_QTY = 50;
  const INITIAL_QTY = 50;

  const sendOrderToWhatsApp = () => {
    // Build order lines
    const orderLines = cartItems.map(item => `${item.product.name} (${item.product.sku}): ${item.quantity} x ₹${item.product.price}`).join('\n');

    const customerInfo = (customerDetails && (customerDetails.name || customerDetails.phone || customerDetails.address))
      ? `Customer:\nName: ${customerDetails.name || '-'}\nPhone: ${customerDetails.phone || '-'}\nAddress: ${customerDetails.address || '-'}, ${customerDetails.city || '-'} ${customerDetails.pincode || ''}`
      : 'Customer: (not provided)';

    const subtotalStr = `Subtotal: ₹${subtotal.toFixed(2)}`;
    const taxStr = `GST (5%): ₹${tax.toFixed(2)}`;
    const totalStr = `Total: ₹${total.toFixed(2)}`;

    const message = `*New Order from Website*\n\n${customerInfo}\n\n*Order Items:*\n${orderLines}\n\n*Summary:*\n${subtotalStr}\n${taxStr}\n${totalStr}\n\nPlease confirm availability and shipping.`;

    const phone = '917011770526'; // Fox
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{minHeight: '50vh'}}>
        <div className="text-center p-10 bg-white rounded-lg shadow-md border border-gray-200 max-w-md mx-auto">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-brand-teal-50 mb-6">
            <ShoppingCartIcon className="w-8 h-8 text-brand-teal-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Your cart is empty</h3>
          <p className="text-gray-600 mt-2 mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <a href="#/" className="inline-block bg-brand-teal-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-teal-600 transition-all duration-300 transform hover:scale-105">
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Your Shopping Cart</h1>
            <p className="text-gray-600 mt-2">Review your items and proceed to checkout</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900">Cart Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {cartItems.map(({ product, quantity }) => (
                    <div key={product.id} className="flex gap-4 p-6 hover:bg-gray-50 transition-colors">
                      <a href={`#/product/${product.id}`}>
                        <img
                          src={product.imageUrls && product.imageUrls[0] ? (product.imageUrls[0].startsWith('/') ? product.imageUrls[0] : `/${product.imageUrls[0]}`) : '/images/no-image.png'}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200 hover:border-brand-teal-500 transition-colors"
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
                      </a>
                      <div className="flex-grow min-w-0">
                        <a href={`#/product/${product.id}`} className="block font-bold text-gray-900 hover:text-brand-teal-500 transition-colors truncate">{product.name}</a>
                        <p className="text-sm text-gray-600 mt-1">SKU: {product.sku}</p>
                        <button onClick={() => onRemoveItem(product.id)} className="text-xs text-red-600 hover:text-red-700 font-medium mt-2 hover:underline">
                          Remove Item
                        </button>
                      </div>
                      <div className="flex flex-col items-end gap-2 min-w-max">
                        <p className="font-bold text-gray-900">₹{(product.price * quantity).toFixed(2)}</p>
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                          <input
                            type="number"
                            value={quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value || '0', 10);
                              onUpdateQuantity(product.id, val);
                            }}
                            min={MIN_QTY}
                            aria-label={`Quantity for ${product.name}`}
                            className="w-20 bg-transparent text-center font-medium text-gray-900 border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </div>
                        <p className="text-xs text-gray-500 text-center">Min: {MIN_QTY}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden sticky top-24">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>GST (5%)</span>
                    <span className="font-medium">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 pb-4 border-b border-gray-200">
                    <span>Shipping</span>
                    <span className="font-bold text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-brand-teal-500">₹{total.toFixed(2)}</span>
                  </div>

                  {checkoutError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                      {checkoutError}
                    </div>
                  )}

                  <button
                    onClick={() => setShowCheckoutForm(true)}
                    className="w-full mt-6 bg-brand-teal-500 text-white font-bold py-3 rounded-lg hover:bg-brand-teal-600 transition-colors duration-200"
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={sendOrderToWhatsApp}
                    className="w-full mt-3 bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors duration-200"
                  >
                    Send Order via WhatsApp
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-4">
                    ⓘ Minimum order quantity: {MIN_QTY} pieces per product
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Form Modal */}
        {showCheckoutForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-[#308495] to-[#04BFBF] text-white p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Checkout Details</h2>
                <button onClick={() => setShowCheckoutForm(false)} className="text-2xl hover:opacity-80">×</button>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                setCheckoutError(null);

                // Validate form
                if (!customerDetails.name || !customerDetails.email || !customerDetails.phone || !customerDetails.address || !customerDetails.city || !customerDetails.state || !customerDetails.pincode) {
                  setCheckoutError('Please fill in all fields');
                  return;
                }

                // Validate phone
                if (!/^\d{10}$/.test(customerDetails.phone.replace(/\D/g, ''))) {
                  setCheckoutError('Please enter a valid 10-digit phone number');
                  return;
                }

                // Validate min quantities
                for (const item of cartItems) {
                  if (item.quantity < MIN_QTY) {
                    setCheckoutError(`Minimum order quantity for "${item.product.name}" is ${MIN_QTY} pieces.`);
                    return;
                  }
                }

                try {
                  // Send order details to WhatsApp
                  const orderDetails = cartItems.map(item => 
                    `${item.product.name} (${item.product.sku}): ${item.quantity} x ₹${item.product.price}`
                  ).join('\n');

                  // Create WhatsApp message
                  const whatsappMessage = `Order Details:\n${orderDetails}\n\nTotal: ₹${total}`;

                  // Open WhatsApp with message
                  const whatsappURL = `https://wa.me/917011770526?text=${encodeURIComponent(whatsappMessage)}`;
                  window.open(whatsappURL, '_blank');

                  // Create razorpay order on server
                  // Get recaptcha token first
                  let recaptchaToken = null;
                  try {
                    // dynamically import to avoid bundling if not needed
                    const { getRecaptchaToken } = await import('./ReCaptcha');
                    recaptchaToken = await getRecaptchaToken('checkout');
                  } catch (e) {
                    // ignore
                  }

                  const razorpayOrder = await api.createRazorpayOrder(total, recaptchaToken);

                  // Load Razorpay script if not loaded
                  if (!(window as any).Razorpay) {
                    await new Promise((resolve, reject) => {
                      const script = document.createElement('script');
                      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                      script.onload = resolve;
                      script.onerror = reject;
                      document.body.appendChild(script);
                    });
                  }

                  const options = {
                    key: RAZORPAY_KEY_ID,
                    amount: razorpayOrder.amount,
                    currency: razorpayOrder.currency || 'INR',
                    name: 'Fox',
                    description: 'Order Payment',
                    order_id: razorpayOrder.id,
                    handler: async function (response: any) {
                      try {
                        await api.createOrder(
                          cartItems.map(ci => ({ productId: ci.product.id, quantity: ci.quantity, price: ci.product.price })),
                          total,
                          tax,
                          0,
                          JSON.stringify(customerDetails),
                          `razorpay_payment_id:${response.razorpay_payment_id}`
                        );
                        window.location.href = '#/orders';
                      } catch (err) {
                        console.error(err);
                        setCheckoutError('Payment succeeded but failed to create order. Please contact support.');
                      }
                    },
                    prefill: {
                      name: customerDetails.name,
                      email: customerDetails.email,
                      contact: customerDetails.phone
                    },
                    notes: {
                      address: customerDetails.address,
                      city: customerDetails.city,
                      state: customerDetails.state,
                      pincode: customerDetails.pincode
                    },
                    theme: { color: '#197D86' }
                  };

                  const rzp = new (window as any).Razorpay(options);
                  rzp.open();

                } catch (err) {
                  console.error(err);
                  setCheckoutError('Unable to initialize payment. Please try again later.');
                }
              }} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                    <input type="text" required value={customerDetails.name} onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal-500 focus:border-transparent outline-none" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                    <input type="email" required value={customerDetails.email} onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal-500 focus:border-transparent outline-none" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
                    <input type="tel" required value={customerDetails.phone} onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal-500 focus:border-transparent outline-none" placeholder="+91 9999999999" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Pincode *</label>
                    <input type="text" required value={customerDetails.pincode} onChange={(e) => setCustomerDetails({...customerDetails, pincode: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal-500 focus:border-transparent outline-none" placeholder="110053" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Address *</label>
                    <input type="text" required value={customerDetails.address} onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal-500 focus:border-transparent outline-none" placeholder="Street address" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">City *</label>
                    <input type="text" required value={customerDetails.city} onChange={(e) => setCustomerDetails({...customerDetails, city: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal-500 focus:border-transparent outline-none" placeholder="Delhi" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">State *</label>
                    <input type="text" required value={customerDetails.state} onChange={(e) => setCustomerDetails({...customerDetails, state: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal-500 focus:border-transparent outline-none" placeholder="Delhi" />
                  </div>
                </div>

                {checkoutError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {checkoutError}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowCheckoutForm(false)} className="flex-1 px-6 py-3 border-2 border-brand-teal-500 text-brand-teal-500 font-bold rounded-lg hover:bg-brand-teal-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 px-6 py-3 bg-brand-teal-500 text-white font-bold rounded-lg hover:bg-brand-teal-600 transition-colors">
                    Proceed to Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  );
};

export default CartPage;

