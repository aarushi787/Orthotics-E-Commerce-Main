/**
 * WhatsApp Integration Utilities
 * Handles WhatsApp sharing, messages, and contact links
 */

// Business WhatsApp number (use your actual business number)
export const BUSINESS_WHATSAPP_NUMBER = "917011770526"; // Replace with actual number

/**
 * Format phone number to WhatsApp format (remove special chars, add country code if needed)
 */
export const formatWhatsAppNumber = (phone: string): string => {
  // Remove all non-digit characters
  let formatted = phone.replace(/\D/g, "");

  // If number doesn't start with country code, assume India (+91)
  if (formatted.length === 10) {
    formatted = "91" + formatted;
  } else if (formatted.length === 11 && formatted.startsWith("0")) {
    formatted = "91" + formatted.slice(1);
  }

  // Ensure it starts with country code
  if (!formatted.startsWith("91") && formatted.length === 10) {
    formatted = "91" + formatted;
  }

  return formatted;
};

/**
 * Generate WhatsApp message for product inquiry
 */
export const generateProductMessage = (productName: string, sku: string, price: number): string => {
  return `Hi! I'm interested in the "${productName}" (SKU: ${sku}). Could you provide more details? Price: ₹${price}`;
};

/**
 * Generate WhatsApp message for order inquiry
 */
export const generateOrderMessage = (orderId: string, totalAmount: number): string => {
  return `Hi! I'd like to inquire about order #${orderId}. Total amount: ₹${totalAmount}`;
};

/**
 * Generate WhatsApp message for customer inquiry
 */
export const generateCustomerMessage = (name: string, email: string, message: string): string => {
  return `Name: ${name}%0AEmail: ${email}%0AMessage: ${message}`;
};

/**
 * Generate WhatsApp link for direct chat
 */
export const getWhatsAppChatLink = (phoneNumber: string, message?: string): string => {
  const formattedPhone = formatWhatsAppNumber(phoneNumber);
  if (message) {
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${formattedPhone}?text=${encoded}`;
  }
  return `https://wa.me/${formattedPhone}`;
};

/**
 * Generate WhatsApp link for business contact
 */
export const getBusinessWhatsAppLink = (message?: string): string => {
  return getWhatsAppChatLink(BUSINESS_WHATSAPP_NUMBER, message);
};

/**
 * Open WhatsApp chat in new window
 */
export const openWhatsAppChat = (phoneNumber: string, message?: string): void => {
  const link = getWhatsAppChatLink(phoneNumber, message);
  window.open(link, "_blank", "width=800,height=600");
};

/**
 * Open business WhatsApp chat
 */
export const openBusinessWhatsApp = (message?: string): void => {
  openWhatsAppChat(BUSINESS_WHATSAPP_NUMBER, message);
};

/**
 * Share product via WhatsApp
 */
export const shareProductViaWhatsApp = (productName: string, productUrl: string, price: number): void => {
  const message = `Check out this product! 👇\n${productName}\nPrice: ₹${price}\n${productUrl}`;
  openBusinessWhatsApp(message);
};

/**
 * Generate WhatsApp order notification message
 */
export const generateOrderNotificationMessage = (
  customerName: string,
  orderId: string,
  totalAmount: number,
  itemCount: number
): string => {
  return `New Order! 📦\nCustomer: ${customerName}\nOrder ID: ${orderId}\nItems: ${itemCount}\nTotal: ₹${totalAmount}`;
};

/**
 * Generate WhatsApp order status update message
 */
export const generateOrderStatusMessage = (orderId: string, status: string, estimatedDelivery?: string): string => {
  let message = `Order Update! 📦\nOrder ID: ${orderId}\nStatus: ${status}`;
  if (estimatedDelivery) {
    message += `\nEstimated Delivery: ${estimatedDelivery}`;
  }
  return message;
};
