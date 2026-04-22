import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Image as ImageIcon, Briefcase, Star, MessageSquare, User, Menu, X, Phone } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={20}/> },
    { name: 'Portfolio', path: '/portfolio', icon: <ImageIcon size={20}/> },
    { name: 'Services', path: '/services', icon: <Briefcase size={20}/> },
    { name: 'Reviews', path: '/reviews', icon: <Star size={20}/> },
    { name: 'Contact', path: '/book', icon: <Phone size={20}/> },
  ];

  return (
    <>
      {/* 🖥️ DESKTOP TOP NAVBAR */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 hidden md:block ${
          isScrolled ? 'py-4 bg-black/90 backdrop-blur-xl border-b border-white/5' : 'py-8 bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-blue rounded-lg flex items-center justify-center font-black text-xl">S</div>
            <span className="text-xl font-black tracking-tighter uppercase italic">Shutters By Shella</span>
          </Link>

          <div className="flex items-center gap-10 font-bold uppercase tracking-widest text-[0.7rem]">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={`transition-all hover:text-brand-blue ${location.pathname === link.path ? 'text-brand-blue' : 'text-white/60'}`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/admin" className="px-5 py-2 rounded-full border border-white/10 hover:border-brand-blue transition-all">ADMIN</Link>
          </div>
        </div>
      </nav>

      {/* 📱 MOBILE TOP HEADER (LOGO ONLY) */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-[100] p-6 bg-black/50 backdrop-blur-xl border-b border-white/5 flex justify-between items-center">
         <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center font-black text-sm">S</div>
            <span className="font-black uppercase italic text-sm tracking-tighter">Shutters By Shella</span>
         </Link>
         <Link to="/admin" className="p-2 bg-white/5 rounded-lg text-white/40"><User size={20}/></Link>
      </header>

      {/* 📱 MOBILE BOTTOM NAVIGATION BAR (USER FRIENDLY) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-black/80 backdrop-blur-2xl border-t border-white/10 px-4 py-3 flex justify-around items-center">
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            to={link.path}
            className={`flex flex-col items-center gap-1 transition-all ${
              location.pathname === link.path ? 'text-brand-blue scale-110' : 'text-white/40'
            }`}
          >
            {link.icon}
            <span className="text-[0.6rem] font-black uppercase tracking-tighter">{link.name}</span>
            {location.pathname === link.path && (
              <motion.div layoutId="nav-dot" className="w-1 h-1 bg-brand-blue rounded-full mt-1" />
            )}
          </Link>
        ))}
      </nav>
    </>
  );
};

export default Navbar;
