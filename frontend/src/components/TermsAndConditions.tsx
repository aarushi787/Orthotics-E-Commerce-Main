import React from 'react';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-6 text-slate-900">Terms & Conditions</h1>
      
      <p className="text-slate-600 mb-6">
        <strong>Effective Date:</strong> January 8, 2026
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">1. Agreement to Terms</h2>
        <p className="text-slate-700 mb-4">
          By accessing and using the brsurgicals.com website operated by Fox, you accept and agree to be bound by and comply with these Terms and Conditions.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">2. Business Information</h2>
        <p className="text-slate-700 mb-4">
          <strong>Business Name:</strong> Fox (BR Surgicals)<br />
          <strong>Business Type:</strong> Orthopedic Medical Devices Manufacturer & Seller<br />
          <strong>Location:</strong> Delhi, India<br />
          <strong>Registration:</strong> ISO 13485 Certified, FDA Approved, CE Marked
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">3. Purpose of Website</h2>
        <p className="text-slate-700 mb-4">
          This website provides information about Fox' premium orthopedic products and solutions. Products are intended for medical use and should be used under professional guidance.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">4. Disclaimer of Warranties</h2>
        <p className="text-slate-700 mb-4">
          The information and products on this website are provided "as is" without warranty of any kind. We do not warrant that the website will be uninterrupted or error-free.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">5. Limitation of Liability</h2>
        <p className="text-slate-700 mb-4">
          In no event shall Fox be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the website or products.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">6. Product Information</h2>
        <p className="text-slate-700 mb-4">
          Product descriptions, images, pricing, and specifications are provided for informational purposes. Fox reserves the right to modify product information without notice.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">7. Intellectual Property</h2>
        <p className="text-slate-700 mb-4">
          All content on this website, including text, graphics, logos, images, and software, is the property of Fox or its content suppliers and is protected by copyright laws.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">8. Jurisdiction</h2>
        <p className="text-slate-700 mb-4">
          These Terms and Conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts of Delhi, India.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">9. Contact for Legal Matters</h2>
        <p className="text-slate-700 mb-4">
          For questions about these Terms and Conditions, contact us at:
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

export default TermsAndConditions;
