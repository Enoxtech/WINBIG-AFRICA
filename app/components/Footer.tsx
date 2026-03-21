'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-deep-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center">
                <span className="text-deep-blue font-bold text-lg">W</span>
              </div>
              <span className="font-bold text-xl text-white">WINBIG <span className="text-gold">AFRICA</span></span>
            </div>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed">
              Africa&apos;s most trusted lottery and raffle platform. Win big with small entry fees. 
              Transparent, fair, and secure.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/#campaigns" className="text-gray-400 hover:text-gold transition-colors text-sm">Campaigns</Link></li>
              <li><Link href="/#how-it-works" className="text-gray-400 hover:text-gold transition-colors text-sm">How It Works</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-gold transition-colors text-sm">About Us</Link></li>
              <li><Link href="/#contact" className="text-gray-400 hover:text-gold transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/legal/terms" className="text-gray-400 hover:text-gold transition-colors text-sm">Terms & Conditions</Link></li>
              <li><Link href="/legal/privacy" className="text-gray-400 hover:text-gold transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/legal/refund" className="text-gray-400 hover:text-gold transition-colors text-sm">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">&copy; 2026 WINBIG AFRICA. All rights reserved.</p>
          <p className="text-gray-500 text-xs">Play responsibly. 18+ only.</p>
        </div>
      </div>
    </footer>
  );
}
