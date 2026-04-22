import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaInstagram, FaFacebook, FaYoutube, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

const Footer = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [settings, setSettings] = useState({ 
    socialLinks: { instagram: '', facebook: '', youtube: '' }, 
    phoneNumber: '9000092018', 
    emailAddress: 'contact@seenushella.com' 
  });

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const [vRes, sRes] = await Promise.all([
          axios.get('${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/visitors').catch(() => ({ data: { count: 0 } })),
          axios.get('${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/settings').catch(() => ({ data: {} }))
        ]);
        if (vRes.data) setVisitorCount(vRes.data.count || 0);
        if (sRes.data) setSettings(prev => ({ ...prev, ...sRes.data }));
      } catch (err) {}
    };
    fetchFooterData();
  }, []);

  return (
    <footer className="bg-black border-t border-white/5 pt-20 pb-10 mt-20">
      <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12 mb-20 text-left">
        {/* Brand */}
        <div className="col-span-2">
           <div className="flex items-center gap-3 mb-8">
             <div className="w-12 h-12 bg-brand-blue rounded-xl flex items-center justify-center font-black text-2xl">S</div>
             <div className="flex flex-col leading-none">
               <span className="text-2xl font-black tracking-tighter uppercase">Shutters By Shella</span>
               <span className="text-[0.7rem] text-brand-blue font-bold tracking-[0.4em] uppercase">Premium Studio</span>
             </div>
           </div>
           <p className="text-white/40 max-w-sm mb-8 leading-relaxed">
             Nearly a decade of excellence in visual storytelling. Specialized in capturing raw emotions and cinematic grandeur across 1000+ events.
           </p>
           <div className="flex gap-4">
             <SocialBtn icon={<FaInstagram />} link={settings.socialLinks?.instagram} />
             <SocialBtn icon={<FaFacebook />} link={settings.socialLinks?.facebook} />
             <SocialBtn icon={<FaYoutube />} link={settings.socialLinks?.youtube} />
           </div>
        </div>

        {/* Quick Links */}
        <div>
           <h4 className="text-lg font-bold uppercase tracking-widest mb-8">Navigation</h4>
           <ul className="flex flex-col gap-4 text-white/50 font-bold text-sm">
             <li><Link to="/" className="hover:text-brand-blue transition-colors uppercase">Home</Link></li>
             <li><Link to="/portfolio" className="hover:text-brand-blue transition-colors uppercase">Portfolio</Link></li>
             <li><Link to="/events" className="hover:text-brand-blue transition-colors uppercase">Events</Link></li>
             <li><Link to="/book" className="hover:text-brand-blue transition-colors uppercase">Book a Shoot</Link></li>
           </ul>
        </div>

        {/* Contact */}
        <div>
           <h4 className="text-lg font-bold uppercase tracking-widest mb-8">Contact</h4>
           <ul className="flex flex-col gap-4 text-white/50 text-sm">
             <li className="flex items-center gap-3"><FaPhoneAlt className="text-brand-blue" /> {settings.phoneNumber}</li>
             <li className="flex items-center gap-3"><FaEnvelope className="text-brand-blue" /> {settings.emailAddress}</li>
             <li className="mt-4 pt-4 border-t border-white/10">
                <div className="text-[0.65rem] uppercase tracking-[0.2em] mb-2 font-bold opacity-30">Global Reach</div>
                <div className="text-xl font-black text-white/80">{visitorCount.toLocaleString()} <span className="text-brand-blue">Visitors</span></div>
             </li>
           </ul>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-white/30 text-[0.7rem] font-bold tracking-widest">
         <div className="uppercase">© 2026 Seenu Shella. All Rights Reserved.</div>
         <div className="flex gap-8 uppercase">
           <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
           <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
         </div>
         <div className="opacity-50">DESIGNED FOR EXCELLENCE</div>
      </div>
    </footer>
  );
};

const SocialBtn = ({ icon, link }) => (
  <a 
    href={link || '#'} 
    target="_blank" 
    rel="noreferrer"
    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all"
  >
    {icon}
  </a>
);

export default Footer;
