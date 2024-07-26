import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useGlobalContext } from '../context';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const Navbar = () => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const { user, setShowCreatePost, showCreatePost } = useGlobalContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const cookieToken = Cookies.get('token');
    setToken(cookieToken);
  }, []);

  const handleNavigation = (path) => (e) => {
    e.preventDefault();
    router.push(token ? path : '/login');
  };

  const handleLogout = () => {
    Cookies.remove('token');
    setToken(null);
    router.push('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handlePost = () => {
    setShowCreatePost(!showCreatePost);
    router.push('/profile')
  }

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" passHref>
          <motion.span 
            className="text-2xl font-bold text-white cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            VoyageVista
          </motion.span>
        </Link>
        <div className="flex space-x-4 items-center justify-items-center">
          <NavItem onClick={handleNavigation('/travelHome')}>Home</NavItem>
          <NavItem onClick={handleNavigation('/explore')}>Explore</NavItem>
          {token ? (
            <div className="relative">
              <NavItem onClick={toggleDropdown}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mt-2">
                  <path d="M7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12Z" fill="#ffffff"></path>
                  <path d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z" fill="#ffffff"></path>
                  <path d="M21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12Z" fill="#ffffff"></path>
                </svg>
              </NavItem>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                  >
                    <DropdownItem onClick={handleNavigation('/profile')}>Profile</DropdownItem>
                    <DropdownItem onClick={handleNavigation('/journal')}>Write</DropdownItem>
                    <DropdownItem onClick={handlePost}>Post</DropdownItem>
                    <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <NavItem onClick={handleNavigation('/login')}>Login</NavItem>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ children, onClick }) => (
  <motion.button
    className="text-white hover:text-yellow-300 transition duration-300 ease-in-out font-semibold"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
  >
    {children}
  </motion.button>
);

const DropdownItem = ({ children, onClick }) => (
  <motion.button
    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    // whileHover={{ backgroundColor: '#f3f4f6' }}
    onClick={onClick}
  >
    {children}
  </motion.button>
);

export default Navbar;