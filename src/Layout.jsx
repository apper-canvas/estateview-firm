import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routes } from '@/config/routes';
import SearchBar from '@/components/molecules/SearchBar';
import { useFavorites } from '@/hooks/useFavorites';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { favorites } = useFavorites();

  const visibleRoutes = Object.values(routes).filter(route => !route.hidden);
  const isPropertyDetail = location.pathname.startsWith('/property/');

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex-shrink-0 bg-surface border-b border-gray-200 relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <NavLink to="/" className="flex items-center gap-2 text-xl font-display font-semibold text-primary">
                <ApperIcon name="Home" className="w-8 h-8" />
                EstateView
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <nav className="flex items-center gap-6">
                {visibleRoutes.map(route => (
                  <NavLink
                    key={route.id}
                    to={route.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                        isActive
                          ? 'text-primary bg-primary/10'
                          : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                      }`
                    }
                  >
                    <ApperIcon name={route.icon} className="w-4 h-4" />
                    {route.label}
                    {route.id === 'saved' && favorites.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {favorites.length}
                      </span>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Search Bar - Desktop */}
            {!isPropertyDetail && (
              <div className="hidden lg:block flex-1 max-w-md mx-8">
                <SearchBar />
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-gray-50"
            >
              <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
            </button>
          </div>

          {/* Search Bar - Mobile */}
          {!isPropertyDetail && (
            <div className="lg:hidden pb-4">
              <SearchBar />
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={closeMobileMenu}
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed top-0 right-0 bottom-0 w-64 bg-surface border-l border-gray-200 z-50 md:hidden"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-lg font-display font-semibold text-primary">Menu</span>
                    <button
                      onClick={closeMobileMenu}
                      className="p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-gray-50"
                    >
                      <ApperIcon name="X" className="w-5 h-5" />
                    </button>
                  </div>
                  <nav className="space-y-2">
                    {visibleRoutes.map(route => (
                      <NavLink
                        key={route.id}
                        to={route.path}
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                              ? 'text-primary bg-primary/10'
                              : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                          }`
                        }
                      >
                        <ApperIcon name={route.icon} className="w-5 h-5" />
                        {route.label}
                        {route.id === 'saved' && favorites.length > 0 && (
                          <span className="ml-auto bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {favorites.length}
                          </span>
                        )}
                      </NavLink>
                    ))}
                  </nav>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;