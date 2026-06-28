import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, MapPin, Calendar, Phone, User, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSwipeGesture, useHapticFeedback } from '@/hooks/useTouchGestures';
import { useAdmin } from '@/hooks/useAdmin';
import { cn } from '@/lib/utils';

interface MobileNavigationProps {
  className?: string;
}

const menuItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: MapPin, label: 'Himachal Trips', path: '/himachaltrips' },
  { icon: MapPin, label: 'Backpacking Trips', path: '/backpacking' },
  { icon: Calendar, label: 'Camping', path: '/camping' },
  { icon: Calendar, label: 'Weekend Getaways', path: '/weekends' },
  { icon: MapPin, label: 'International Gateways', path: '/international' },
  { icon: Phone, label: 'Contact', path: '/contact' },
];

export const MobileNavigation = ({ className }: MobileNavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAdmin();
  const { lightTap, mediumTap } = useHapticFeedback();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    mediumTap();
  };

  const closeMenu = () => {
    setIsOpen(false);
    lightTap();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    closeMenu();
    lightTap();
  };

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Swipe to close menu
  const swipeGestures = useSwipeGesture({
    onSwipeLeft: closeMenu,
    threshold: 100
  });

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMenu}
        className={cn(
          'md:hidden relative z-50 p-2 text-white hover:bg-white/20',
          className
        )}
        aria-label="Toggle menu"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={closeMenu}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden"
              {...swipeGestures}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Trek A Tour</h2>
                    <p className="text-orange-100 text-sm">Adventure Awaits</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeMenu}
                    className="text-white hover:bg-white/20 p-2"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-4">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <motion.button
                      key={item.path}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleNavigation(item.path)}
                      className={cn(
                        'w-full flex items-center space-x-4 px-6 py-4 text-left transition-colors',
                        'hover:bg-orange-50 active:bg-orange-100',
                        isActive && 'bg-orange-50 border-r-4 border-orange-600'
                      )}
                    >
                      <Icon className={cn(
                        'w-5 h-5',
                        isActive ? 'text-orange-600' : 'text-gray-600'
                      )} />
                      <span className={cn(
                        'font-medium',
                        isActive ? 'text-orange-600' : 'text-gray-900'
                      )}>
                        {item.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
