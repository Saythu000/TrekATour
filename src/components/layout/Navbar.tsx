import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Shield, 
  MapPin, 
  Mountain, 
  Tent, 
  Backpack, 
  Calendar, 
  Globe, 
  ArrowRight 
} from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import { MobileNavigation } from "@/components/MobileNavigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTripsDropdownOpen, setIsTripsDropdownOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAdmin();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const tripItems = [
    { name: "Himachal Trips", path: "/himachaltrips" },
    { name: "Weekend Getaways", path: "/weekends" },
    { name: "Backpacking Trips", path: "/backpacking" },
    { name: "Camping", path: "/camping" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isTripActive = () => {
    return tripItems.some(item => isActive(item.path));
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <img 
                src="/tat-logo-removebg.png" 
                alt="Trek A Tour Logo" 
                className="w-[200px] h-[200px] object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive("/")
                    ? "text-orange-600"
                    : "text-gray-700 hover:text-orange-600"
                }`}
              >
                Home
              </Link>
              
              {/* Trips Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsTripsDropdownOpen(true)}
                onMouseLeave={() => setIsTripsDropdownOpen(false)}
              >
                <span
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isTripActive()
                      ? "text-orange-600"
                      : "text-gray-700 hover:text-orange-600"
                  }`}
                >
                  Trips
                </span>
                
                {/* Smooth Dropdown Menu */}
                <div className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 ease-out ${
                  isTripsDropdownOpen 
                    ? 'opacity-100 visible transform translate-y-0' 
                    : 'opacity-0 invisible transform -translate-y-2'
                }`}>
                  <div className="py-2">
                    {tripItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`block px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                          isActive(item.path)
                            ? "text-orange-600 bg-orange-50"
                            : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* International Getaways */}
              <Link
                to="/international"
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive("/international")
                    ? "text-orange-600"
                    : "text-gray-700 hover:text-orange-600"
                }`}
              >
                International Getaways
              </Link>

              {/* Other Nav Items */}
              {navItems.slice(1).map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? "text-orange-600"
                      : "text-gray-700 hover:text-orange-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu */}
            <div className="flex items-center">
              {/* Mobile Navigation */}
              <MobileNavigation />
            </div>
          </div>

        </div>
      </nav>
    </>
  );
};

export default Navbar;