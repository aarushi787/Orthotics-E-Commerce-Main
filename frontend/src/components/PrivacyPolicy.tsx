import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-6 text-slate-900">Privacy Policy</h1>
      
      <p className="text-slate-600 mb-6">
        <strong>Effective Date:</strong> January 8, 2026
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">1. Introduction</h2>
        <p className="text-slate-700 mb-4">
          Fox ("we," "us," or "our") operates the brsurgicals.com website. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">2. Information We Collect</h2>
        <p className="text-slate-700 mb-4">We collect minimal personal information:</p>
        <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4">
          <li>Name and email (for inquiries only)</li>
          <li>Phone number (for contact requests only)</li>
          <li>Website usage data (page views, referrer, IP address)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">3. How We Use Your Information</h2>
        <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4">
          <li>To respond to inquiries and contact requests</li>
          <li>To improve website performance and user experience</li>
          <li>To comply with legal obligations</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">4. Data Security</h2>
        <p className="text-slate-700 mb-4">
          We do not store sensitive payment information (such as credit card details) on our servers. All data transmission occurs over secure HTTPS connections. We implement industry-standard security measures to protect your information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">5. Third-Party Services</h2>
        <p className="text-slate-700 mb-4">
          Our website may use third-party services for analytics and hosting. These services have their own privacy policies, and we encourage you to review them.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">6. Contact Us</h2>
        <p className="text-slate-700 mb-4">
          For questions about this Privacy Policy, contact us at:
        </p>
        <p className="text-slate-700">
          Email: <a href="mailto:info@foxorthotics.com" className="text-blue-600 hover:underline">info@foxorthotics.com</a><br />
          Phone: <a href="tel:+917011770526" className="text-blue-600 hover:underline">+91 70117 70526</a><br />
          Address: B-59, Krishna Kunj Gali, North Ghonda, Delhi – 110053, India
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
