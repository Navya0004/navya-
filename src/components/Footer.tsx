/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface FooterProps {
  systemStatus: 'Operational' | 'Degraded' | 'Maintenance';
}

export default function Footer({ systemStatus = 'Operational' }: FooterProps) {
  return (
    <footer className="w-full py-8 bg-[#eff4ff] border-t border-[#c7c4d8] mt-12 mb-16 md:mb-0 select-none">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-8 w-full max-w-7xl mx-auto gap-4">
        <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
          <p className="font-sans text-xs font-bold text-[#565e74]">
            © 2024 Kinetic Ledger Operations
          </p>
          <p className="text-[#464555] font-sans text-xs flex items-center gap-2 mt-0.5 justify-center md:justify-start">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            System Status: <span className="font-semibold text-emerald-700">{systemStatus}</span>
          </p>
        </div>

        <div className="flex gap-6">
          <a 
            className="text-xs text-[#565e74] hover:text-[#3525cd] transition-colors font-semibold" 
            href="#support"
            onClick={(e) => e.preventDefault()}
          >
            Support
          </a>
          <a 
            className="text-xs text-[#565e74] hover:text-[#3525cd] transition-colors font-semibold" 
            href="#privacy"
            onClick={(e) => e.preventDefault()}
          >
            Privacy
          </a>
          <a 
            className="text-xs text-[#565e74] hover:text-[#3525cd] transition-colors font-semibold" 
            href="#api"
            onClick={(e) => e.preventDefault()}
          >
            API Docs
          </a>
        </div>
      </div>
    </footer>
  );
}
