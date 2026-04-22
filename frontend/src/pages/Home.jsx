import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaWhatsapp, FaPhoneAlt, FaCamera, FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight, FaInstagram, FaCheckCircle, FaClock, FaHeart, FaTrophy } from 'react-icons/fa';
import { trackVisitor, trackClick } from '../utils/analytics';

const FALLBACK_HERO = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2069&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1493863641943-9b689da237da?q=80&w=2058&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2000&auto=format&fit=crop"
];

const Home = () => {
  const [settings, setSettings] = useState({
    studioName: 'Shutters By Shella',
    whatsappNumber: '9000092018',
    phoneNumber: '9000092018',
    enableReviews: true
  });
  const [projects, setProjects] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [heroImages, setHeroImages] = useState(FALLBACK_HERO);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages]);

  useEffect(() => {
    trackVisitor();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sRes, pRes, rRes, heroRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/settings`).catch(() => ({ data: {} })),
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/media?limit=6`).catch(() => ({ data: [] })),
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews`).catch(() => ({ data: [] })),
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/media?limit=6&type=image`).catch(() => ({ data: [] }))
      ]);
      if (sRes.data) setSettings(prev => ({ ...prev, ...sRes.data }));
      if (pRes.data) setProjects(pRes.data);
      if (rRes.data) setReviews(rRes.data.slice(0, 5));
      // Use real uploaded images for hero, fallback to Unsplash
      if (heroRes.data && heroRes.data.length > 0) {
        const imageUrls = heroRes.data
          .filter(m => m.type === 'image')
          .slice(0, 6)
          .map(m => m.url);
        if (imageUrls.length > 0) setHeroImages(imageUrls);
      }
    } catch (err) {}
  };

  const whatsappLink = `https://wa.me/91${settings.whatsappNumber}?text=${encodeURIComponent('Hi Seenu Shella, I want to book a shoot.')}`;

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      
      {/* 🎬 MOBILE-FIRST HERO SLIDER */}
      <section className="relative h-[90vh] md:h-screen flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-0"
          >
            <img src={heroImages[currentSlide % heroImages.length]} className="w-full h-full object-cover object-center" alt="Hero" loading="eager" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black" />
          </motion.div>
        </AnimatePresence>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-[8rem] font-black uppercase italic tracking-tighter text-glow leading-none mb-4"
          >
            SHUTTERS <br className="md:hidden" /> BY <span className="text-brand-blue not-italic">SHELLA</span>
          </motion.h1>
          <p className="text-sm md:text-2xl text-white/70 tracking-[0.3em] uppercase italic mb-10">
            Capturing Moments, Creating Memories
          </p>

          {/* Hero Stats */}
          <div className="flex justify-center gap-6 md:gap-12 mb-12 opacity-80">
             <div className="text-center">
               <span className="block text-xl font-bold">9 YRS</span>
               <span className="text-[0.5rem] uppercase tracking-widest text-white/50">Exp.</span>
             </div>
             <div className="w-[1px] h-8 bg-white/20 my-auto" />
             <div className="text-center">
               <span className="block text-xl font-bold">1000+</span>
               <span className="text-[0.5rem] uppercase tracking-widest text-white/50">Events</span>
             </div>
             <div className="w-[1px] h-8 bg-white/20 my-auto" />
             <div className="text-center">
               <span className="block text-xl font-bold">SEENU</span>
               <span className="text-[0.5rem] uppercase tracking-widest text-white/50">Artist</span>
             </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/portfolio" className="btn-premium bg-brand-blue text-white py-4 px-10 shadow-xl shadow-brand-blue/30">VIEW GALLERY</Link>
            <div className="flex gap-4">
              <a href={whatsappLink} className="btn-premium flex-1 border border-white/10 backdrop-blur-md hover:bg-white hover:text-black">WHATSAPP</a>
              <a href={`tel:${settings.phoneNumber}`} className="btn-premium flex-1 border border-white/10 backdrop-blur-md hover:bg-white hover:text-black">CALL NOW</a>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
           {heroImages.map((_, i) => (
             <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-8 bg-brand-blue' : 'w-2 bg-white/20'}`} />
           ))}
        </div>
      </section>

      {/* ⭐ WHY CHOOSE US (SWIPEABLE ON MOBILE) */}
      <section className="py-20 bg-[#050505]">
        <div className="container mx-auto px-6">
           <h2 className="text-3xl font-black uppercase italic mb-10 tracking-tighter">Why <span className="text-brand-blue not-italic">Choose Us</span></h2>
           <div className="flex overflow-x-auto gap-4 pb-6 snap-x no-scrollbar">
              <SwipeCard icon={<FaCamera/>} title="High Quality" desc="4K Cinematic Gear" />
              <SwipeCard icon={<FaClock/>} title="Fast Delivery" desc="Quick Turnaround" />
              <SwipeCard icon={<FaStar/>} title="Top Rated" desc="1000+ Happy Clients" />
              <SwipeCard icon={<FaHeart/>} title="Passion" desc="9+ Years Mastery" />
           </div>
        </div>
      </section>

      {/* 📸 SERVICES SECTION */}
      <section className="py-20">
         <div className="container mx-auto px-6">
           <h2 className="text-3xl font-black uppercase italic mb-10 tracking-tighter">Our <span className="text-brand-blue not-italic">Services</span></h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ServiceLink to="/services/Wedding" img="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000" title="Marriage Photography" />
              <ServiceLink to="/services/Events" img="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000" title="Event Photography" />
              <ServiceLink to="/services/Portraits" img="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000" title="Portrait Photography" />
              <ServiceLink to="/services/Pre-wedding" img="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000" title="Pre-Wedding Shoots" />
           </div>
         </div>
      </section>

      {/* 🖼️ MINI GALLERY (2-COLUMN) */}
      <section className="py-20 bg-[#050505]">
         <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-black uppercase italic mb-10 tracking-tighter text-left">Our <span className="text-brand-blue not-italic">Work</span></h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
               {projects.slice(0, 4).map(p => (
                 <div key={p._id} className="aspect-[4/5] rounded-2xl overflow-hidden bg-white/5 border border-white/5">
                   <img src={p.url} className="w-full h-full object-cover" alt="Portfolio" />
                 </div>
               ))}
            </div>
            <Link to="/portfolio" className="text-brand-blue font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2">
               SEE ALL WORK <FaChevronRight size={10}/>
            </Link>
         </div>
      </section>

      {/* 👤 ABOUT SECTION (MOBILE UI) */}
      <section className="py-20">
         <div className="container mx-auto px-6 flex flex-col md:flex-row gap-10 items-center">
            <div className="w-full md:w-1/2 aspect-square rounded-[3rem] overflow-hidden border-8 border-white/5 shadow-2xl shadow-brand-blue/10">
               <img src="/seenu-shella.jpg" className="w-full h-full object-cover object-top" alt="Seenu Shella" />
            </div>
            <div className="w-full md:w-1/2">
               <span className="text-brand-blue font-bold tracking-widest text-[0.6rem] uppercase mb-4 block">The Visionary</span>
               <h2 className="text-4xl md:text-6xl font-black uppercase italic mb-6">About <br className="hidden md:block" /> <span className="text-brand-blue not-italic">Seenu Shella</span></h2>
               <p className="text-white/50 text-sm leading-relaxed mb-8 italic">
                 With over 9 years of dedicated experience and 1000+ events successfully covered, Seenu Shella has redefined cinematic photography. Every click is a blend of artistry and technical mastery, ensuring your memories are captured forever.
               </p>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                     <span className="block text-2xl font-black text-brand-blue">9+</span>
                     <span className="text-[0.5rem] uppercase font-bold text-white/30 tracking-widest">Years Experience</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                     <span className="block text-2xl font-black text-brand-blue">1000+</span>
                     <span className="text-[0.5rem] uppercase font-bold text-white/30 tracking-widest">Events Covered</span>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 💬 REVIEWS (SWIPEABLE) */}
      {settings.enableReviews && (
        <section className="py-20 bg-[#050505]">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-black uppercase italic mb-10 tracking-tighter">Kind <span className="text-brand-blue not-italic">Words</span></h2>
            <div className="flex overflow-x-auto gap-4 pb-10 snap-x no-scrollbar">
              {reviews.map(rev => (
                <div key={rev._id} className="min-w-[85%] md:min-w-[350px] snap-center glass-card p-8 border-white/5">
                  <div className="flex text-brand-blue mb-4">{'★'.repeat(rev.rating)}</div>
                  <p className="text-sm text-white/60 mb-6 italic">"{rev.message}"</p>
                  <h4 className="font-bold uppercase tracking-widest text-xs">- {rev.name}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 📸 INSTAGRAM SECTION */}
      <section className="py-20">
         <div className="container mx-auto px-6">
            <div className="flex justify-between items-center mb-10">
               <h2 className="text-3xl font-black uppercase italic tracking-tighter">Follow <span className="text-brand-blue not-italic">Us</span></h2>
               <a href="https://instagram.com" className="text-brand-blue"><FaInstagram size={24}/></a>
            </div>
            <div className="grid grid-cols-3 gap-2">
               {[1,2,3,4,5,6].map(i => (
                 <div key={i} className="aspect-square bg-white/5 rounded-xl overflow-hidden">
                    <img src={`https://images.unsplash.com/photo-${1511285560929 + i}-80b456fea0bc?q=80&w=400`} className="w-full h-full object-cover opacity-50" alt="Insta" />
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 👣 FOOTER */}
      <footer className="py-20 bg-black border-t border-white/5">
         <div className="container mx-auto px-6 text-center">
            <div className="flex justify-center gap-3 mb-6">
               <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center font-black">S</div>
               <span className="font-black uppercase italic tracking-tighter">Shutters By Shella</span>
            </div>
            <p className="text-white/20 text-[0.6rem] font-bold uppercase tracking-widest mb-8">Professional Photography Services</p>
            <div className="flex justify-center gap-8 text-white/40 uppercase tracking-widest text-[0.6rem] font-black mb-10">
               <Link to="/portfolio">Portfolio</Link>
               <Link to="/services">Services</Link>
               <Link to="/admin">Admin</Link>
            </div>
            <p className="text-white/10 text-[0.5rem] uppercase tracking-widest">© 2026 SHUTTERS BY SHELLA. ALL RIGHTS RESERVED.</p>
         </div>
      </footer>

      {/* 📞 STICKY CONTACT BAR (MOBILE) */}
      <div className="fixed bottom-6 left-6 right-6 md:hidden z-50 flex gap-3">
         <a href={whatsappLink} className="flex-1 bg-[#25D366] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 shadow-2xl">
            <FaWhatsapp size={18}/> WhatsApp
         </a>
         <a href={`tel:${settings.phoneNumber}`} className="flex-1 bg-brand-blue text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 shadow-2xl">
            <FaPhoneAlt size={16}/> Call Now
         </a>
      </div>
    </div>
  );
};

const SwipeCard = ({ icon, title, desc }) => (
  <div className="min-w-[160px] snap-center bg-white/5 p-6 rounded-[2rem] border border-white/5 text-center">
    <div className="text-brand-blue text-2xl mb-4 flex justify-center">{icon}</div>
    <h3 className="text-xs font-black uppercase italic mb-1">{title}</h3>
    <p className="text-[0.5rem] text-white/30 uppercase font-bold tracking-widest">{desc}</p>
  </div>
);

const ServiceLink = ({ to, img, title }) => (
  <Link to={to} className="relative h-40 rounded-[2rem] overflow-hidden group">
     <img src={img} className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110" alt={title} />
     <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-6 flex flex-col justify-end">
        <h3 className="text-xl font-black uppercase italic group-hover:text-brand-blue transition-colors">{title}</h3>
     </div>
  </Link>
);

export default Home;
