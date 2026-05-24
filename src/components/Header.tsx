/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Boxes, Search } from 'lucide-react';

interface HeaderProps {
  activeTab: 'products' | 'reservations' | 'settings';
  setActiveTab: (tab: 'products' | 'reservations' | 'settings') => void;
  reservationCount: number;
}

export default function Header({ activeTab, setActiveTab, reservationCount }: HeaderProps) {
  return (
    <header className="w-full sticky top-0 z-40 bg-white border-b border-[#e5eeff] shadow-sm">
      <div className="flex justify-between items-center px-4 md:px-8 py-3 w-full max-w-7xl mx-auto">
        {/* Brand logo and title */}
        <div 
          className="flex items-center gap-2 cursor-pointer select-none group" 
          onClick={() => setActiveTab('products')}
        >
          <div className="p-2 bg-[#e5eeff] rounded-lg text-[#3525cd] transition-colors group-hover:bg-[#3525cd] group-hover:text-white">
            <Boxes className="w-6 h-6 transition-transform group-hover:scale-105" />
          </div>
          <h1 className="font-sans text-xl md:text-2xl font-bold tracking-tight text-[#3525cd]">
            Kinetic Ledger
          </h1>
        </div>

        {/* Navigation tabs for desktop */}
        <nav className="hidden md:flex gap-1 items-center bg-[#f8f9ff] p-1 rounded-xl border border-[#e5eeff]">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg font-sans text-sm font-semibold transition-all ${
              activeTab === 'products'
                ? 'bg-[#3525cd] text-white shadow-sm'
                : 'text-[#464555] hover:text-[#0b1c30] hover:bg-[#e5eeff]'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-4 py-2 rounded-lg font-sans text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'reservations'
                ? 'bg-[#3525cd] text-white shadow-sm'
                : 'text-[#464555] hover:text-[#0b1c30] hover:bg-[#e5eeff]'
            }`}
          >
            Reservations
            {reservationCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                activeTab === 'reservations' ? 'bg-white text-[#3525cd]' : 'bg-[#3525cd] text-white'
              }`}>
                {reservationCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg font-sans text-sm font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-[#3525cd] text-white shadow-sm'
                : 'text-[#464555] hover:text-[#0b1c30] hover:bg-[#e5eeff]'
            }`}
          >
            Settings
          </button>
        </nav>

        {/* Global actions and mini profile */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTab('products')}
            className="p-2 text-[#464555] hover:text-[#3525cd] hover:bg-[#f8f9ff] rounded-full transition-colors"
            title="Search Products"
          >
            <Search className="w-5 h-5" />
          </button>

          <div 
            onClick={() => setActiveTab('settings')}
            className="w-10 h-10 rounded-full bg-[#dae2fd] flex items-center justify-center overflow-hidden border border-[#c7c4d8] cursor-pointer hover:border-[#3525cd] transition-all hover:scale-105"
            title="User Settings"
          >
            <img 
              alt="User Profile" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHcSPm1-HXcl23_DSlzq5tJmZNLkF5lsZvHTUZQTVYjUF_XeDka23ZaKyWUn4lbn2zzkYdGMue2eKEgQsMaogBJempByFDCr_nVyrr1TM0E0QeSuYrV4ZiKMEcpb6NctgRsHFNNHjIU3dKkNqhwd2Yiu7paG08M-iaSY9Wuf2lrtSwfNPwG_vv-HIm6OxG9BeQbWv1U06YGaDGafAkp4B3ak3CDVj28jC82IucPakvgEidpltV2YVKlczWqYPa06s__tp_ju3tiLSO"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
