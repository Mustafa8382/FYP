import React from 'react';
import { MapPin, Phone, Mail } from "lucide-react";
import { FaLinkedin, FaFacebook, FaGithub } from "react-icons/fa";
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-blue-900 dark:bg-[#0f172a] text-white dark:text-gray-100 transition-all duration-500">
      <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10 border-t border-blue-800 dark:border-gray-700">

        {/* --- Brand Info --- */}
        <div>
          <h2 className="text-2xl font-bold mb-3">AM Real Estate</h2>
          <p className="text-gray-300 dark:text-gray-400 leading-relaxed">
            Trusted Real Estate Solutions in Kasur.<br />
            Find your dream home with us today.
          </p>
        </div>

        {/* --- Quick Links --- */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-300 dark:text-gray-400">
            {[
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Properties", href: "/properties" },
              { label: "Contact", href: "/contact2" },
              { label: "Converter", href: "/conversion" },
            ].map(({ label, href }) => (
              <li key={label}>
                <Link
                  to={href}
                  className="hover:text-white dark:hover:text-blue-400 transition duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* --- Contact Info & Socials --- */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
          <ul className="space-y-2 text-gray-300 dark:text-gray-400 text-sm">
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Noor Shah Wali, Kasur
            </li>
            <li>
              <a
                href="tel:+923254634574"
                className="flex items-center gap-2 hover:text-white dark:hover:text-blue-400 transition"
              >
                <Phone className="w-4 h-4" />
                +92-3254634574
              </a>
            </li>
            <li>
              <a
                href="mailto:ataulmustafajani@gmail.com"
                className="flex items-center gap-2 hover:text-white dark:hover:text-blue-400 transition"
              >
                <Mail className="w-4 h-4" />
                ataulmustafajani@gmail.com
              </a>
            </li>
          </ul>

          <div className="flex mt-4 space-x-4 text-xl">
            <a
              href="https://www.facebook.com/share/15XPzJ4k95/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-300 dark:hover:text-blue-500 transition"
            >
              <FaFacebook />
            </a>
            <a
              href="https://github.com/Mustafa8382"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-300 dark:hover:text-blue-500 transition"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/ataulmustafaansari"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-300 dark:hover:text-blue-500 transition"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* --- Bottom Note --- */}
      <div className="text-center text-sm text-gray-400 dark:text-gray-500 border-t border-blue-800 dark:border-gray-700 py-5">
        © {new Date().getFullYear()} AM Real Estate. All rights reserved.
      </div>
      
    </footer>
  );
}
