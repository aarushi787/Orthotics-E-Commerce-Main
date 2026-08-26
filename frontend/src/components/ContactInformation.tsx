import React from 'react';

const ContactInformation: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-6 text-slate-900">Contact Information</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Details */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-slate-800">Get in Touch</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Business Name</h3>
              <p className="text-slate-700">Fox (BR Surgicals)</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Email</h3>
              <p className="text-slate-700">
                <a href="mailto:info@foxorthotics.com" className="text-blue-600 hover:underline">
                  info@foxorthotics.com
                </a>
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Phone</h3>
              <p className="text-slate-700">
                <a href="tel:+917011770526" className="text-blue-600 hover:underline">
                  +91 70117 70526
                </a>
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Address</h3>
              <p className="text-slate-700">
                B-59, Krishna Kunj Gali,<br />
                North Ghonda,<br />
                Delhi – 110053,<br />
                India
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Hours</h3>
              <p className="text-slate-700">
                Monday – Friday: 9:00 AM – 6:00 PM IST<br />
                Saturday: 10:00 AM – 4:00 PM IST<br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-slate-800">About Fox</h2>
          
          <div className="space-y-4 text-slate-700">
            <p>
              Fox is a leading manufacturer and supplier of premium orthopedic solutions and medical devices. With over 35 years of industry leadership, we are committed to enhancing mobility and comfort for our customers.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <p className="font-semibold text-slate-800 mb-2">Certifications & Quality Standards:</p>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                <li>ISO 13485 Certified</li>
                <li>FDA Approved Products</li>
                <li>CE Marked Quality</li>
              </ul>
            </div>

            <p>
              We provide a wide range of orthopedic braces, supports, and medical devices designed to meet international standards and provide optimal patient care.
            </p>

            <p>
              For inquiries about products, wholesale, dealer partnerships, or any other questions, please use the contact information on the left or email us directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;
