import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function MainHeader() {
  const navigate = useNavigate();
  const [isCustomersOpen, setIsCustomersOpen] = useState(false);

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="header-glass px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="text-xl font-bold">
            <span className="text-[#58A6FF]">CODE</span>
            <span className="text-[#39C5E4]">VENGERS</span>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/use-cases" className="text-gray-300 hover:text-white transition-colors text-sm">
              Use Cases
            </a>
            <a href="/platform" className="text-gray-300 hover:text-white transition-colors text-sm">
              Platform
            </a>
            <div className="relative">
              <button
                onClick={() => setIsCustomersOpen(!isCustomersOpen)}
                className="text-gray-300 hover:text-white transition-colors text-sm flex items-center gap-1"
              >
                Customers
                <ChevronDown className="w-4 h-4" />
              </button>
              {isCustomersOpen && (
                <div className="dropdown-glass absolute top-full mt-2 w-48 py-2">
                  <a href="/universities" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5">
                    Universities
                  </a>
                  <a href="/colleges" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5">
                    Colleges
                  </a>
                  <a href="/institutes" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5">
                    Institutes
                  </a>
                </div>
              )}
            </div>
            <a href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">
              Contact
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}