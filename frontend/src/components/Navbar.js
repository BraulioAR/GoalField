import { Link, useNavigate } from 'react-router-dom';
import { Home, Calendar, User, LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-green-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-2xl font-bold text-green-600 hover:text-green-700 transition-colors"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">⚽</span>
            </div>
            <span>GoalField</span>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-1">
            <li>
              <Link 
                to="/" 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition-all"
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Inicio</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/services" 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition-all"
              >
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Canchas</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/profile" 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition-all"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Perfil</span>
              </Link>
            </li>
            {!token && (
              <li>
                <Link 
                  to="/login" 
                  className="flex items-center space-x-2 ml-4 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="font-semibold">Iniciar Sesión</span>
                </Link>
              </li>
            )}
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-green-50 text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 animate-slide-down">
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Inicio</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/services" 
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">Canchas</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Perfil</span>
                </Link>
              </li>
              {!token && (
                <li>
                  <Link 
                    to="/login" 
                    className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogIn className="w-5 h-5" />
                    <span className="font-semibold">Iniciar Sesión</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;