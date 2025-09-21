import React from 'react';
import type { View } from '../types';

interface FooterProps {
  onNavigate: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const footerLinks = [
    { name: 'About Us', view: 'about' },
    { name: 'Contact Us', view: 'contact' },
    { name: 'Disclaimer', view: 'disclaimer' },
    { name: 'Privacy Policy', view: 'privacy' },
    { name: 'Terms and Conditions', view: 'terms' },
  ];

  return (
    <footer className="w-full max-w-3xl mx-auto mt-12 mb-6 border-t border-gray-700 pt-6">
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
        {footerLinks.map((link) => (
          <button
            key={link.name}
            onClick={() => onNavigate(link.view as View)}
            className="text-gray-400 hover:text-indigo-400 transition-colors text-sm"
          >
            {link.name}
          </button>
        ))}
      </div>
      <p className="text-center text-gray-500 text-xs mt-6">
        © {new Date().getFullYear()} Gosai AI Blog Article Generator. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
