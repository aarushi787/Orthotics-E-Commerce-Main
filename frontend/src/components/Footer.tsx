import React from 'react';
import {
  MailIcon,
  PhoneIcon,
  LocationMarkerIcon,
  CertificateIcon,
  ShieldCheckIcon,
} from './icons';
import { CATEGORIES } from '../constants';

const slugify = (text: string) =>
  text.toLowerCase().replace(/ & /g, '-and-').replace(/\s+/g, '-');

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      {/* ================= Trust Badges ================= */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex items-center justify-center gap-3 text-sm">
            <CertificateIcon className="w-7 h-7 text-teal-400" />
            <span className="font-semibold text-white">
              ISO 13485 Certified
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 text-sm">
            <ShieldCheckIcon className="w-7 h-7 text-teal-400" />
            <span className="font-semibold text-white">
              FDA Approved Products
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 text-sm">
            <span className="font-bold text-sm border border-teal-400 text-teal-400 rounded-full w-8 h-8 flex items-center justify-center">
              CE
            </span>
            <span className="font-semibold text-white">
              CE Marked Quality
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 text-sm">
            <span className="text-xl font-bold text-teal-400">35+</span>
            <span className="font-semibold text-white">
              Years of Industry Leadership
            </span>
          </div>
        </div>
      </div>

      {/* ================= Main Footer ================= */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* -------- About -------- */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
                Fox
              </h3>

            <p className="text-sm leading-relaxed">
              Your trusted partner for premium orthopedic solutions,
              dedicated to enhancing mobility and comfort.
            </p>

            <div className="flex items-center gap-4 mt-5">
              <a href="#" aria-label="Facebook" className="hover:text-white">
                Facebook
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-white">
                Twitter
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-white">
                LinkedIn
              </a>
            </div>
          </div>

          {/* -------- Categories -------- */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-l-4 border-teal-400 pl-3 text-white">
              Top Categories
            </h3>

            <ul className="space-y-2 text-sm">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.name}>
                  <a
                    href={`#/category/${slugify(cat.name)}`}
                    className="hover:text-white transition-all"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
              <li>
                <a href="#/" className="hover:text-white">
                  … and more
                </a>
              </li>
            </ul>
          </div>

          {/* -------- Contact -------- */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-l-4 border-teal-400 pl-3 text-white">
              Contact Us
            </h3>

            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <LocationMarkerIcon className="w-5 h-5 text-teal-400 mt-0.5" />
                <span>
                  B-59, Krishna Kunj Gali, North Ghonda,
                  Delhi – 110053
                </span>
              </li>

              <li className="flex items-center gap-3">
                <PhoneIcon className="w-5 h-5 text-teal-400" />
                <a href="tel:+917011770526" className="hover:text-white">
                  +91 70117 70526
                </a>
              </li>

              <li className="flex items-center gap-3">
                <MailIcon className="w-5 h-5 text-teal-400" />
                <a
                  href="mailto:info@foxorthotics.com"
                  className="hover:text-white"
                >
                  info@foxorthotics.com
                </a>
              </li>
            </ul>
          </div>

          {/* -------- Company -------- */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-l-4 border-teal-400 pl-3 text-white">
              Company
            </h3>

            <ul className="space-y-2 text-sm mb-6">
              <li>
                <a href="#/about" className="hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#/contact" className="hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#/dealer" className="hover:text-white">
                  Become a Dealer
                </a>
              </li>
            </ul>

            <h3 className="text-lg font-semibold mb-2 text-white">
              We Accept
            </h3>
            <p className="text-sm">
              Credit Card, Debit Card, Bank Transfer, UPI
            </p>
          </div>
        </div>
      </div>

      {/* ================= Bottom Bar ================= */}
      <div className="bg-slate-950 py-4">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-sm text-slate-400">
          <span>
            © {new Date().getFullYear()} Fox.
            All Rights Reserved.
          </span>

          <div className="flex gap-4 mt-2 sm:mt-0">
            <a href="#/privacy" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="#/terms" className="hover:text-white">
              Terms of Service
            </a>
            <a href="#/contact-info" className="hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;