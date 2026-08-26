declare global {
  interface Window {
    Razorpay?: any;
  }
}

export default function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject("Razorpay SDK failed to load.");
    document.body.appendChild(script);
  });
}
