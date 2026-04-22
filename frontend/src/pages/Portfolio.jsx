import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaExpand, FaDownload, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Portfolio = () => {
  const [media, setMedia] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    fetchMedia();
  }, [filter]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:5000/api/media?category=${filter}`);
      setMedia(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const filteredMedia = media.filter(item => 
    item.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase())) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const nextImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % filteredMedia.length);
    }
  };

  const prevImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + filteredMedia.length) % filteredMedia.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') setSelectedIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredMedia]);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  const selectedItem = selectedIndex !== null ? filteredMedia[selectedIndex] : null;

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-brand-blue font-bold tracking-[0.4em] uppercase text-xs mb-4 block">The Gallery</span>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic mb-8 italic">Master <span className="text-brand-blue not-italic">Archive</span></h1>
          
          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center max-w-4xl mx-auto mt-12 bg-white/5 p-4 rounded-[2rem] border border-white/10 backdrop-blur-xl">
             <div className="relative flex-1 w-full">
                <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30" />
                <input 
                  type="text" 
                  placeholder="Search by tag (Cinematic, Wedding...)" 
                  className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-14 pr-6 focus:border-brand-blue outline-none transition-all font-bold text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
             </div>
             <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                {['all', 'Wedding', 'Pre-wedding', 'Events', 'Portraits'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                      filter === cat ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30' : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
             </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="aspect-[3/4] bg-white/5 rounded-3xl animate-pulse" />)}
          </div>
        ) : (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="masonry-grid"
            columnClassName="masonry-grid_column"
          >
            {filteredMedia.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="mb-6 relative group cursor-pointer overflow-hidden rounded-[2rem] border border-white/10"
                onClick={() => setSelectedIndex(i)}
              >
                {item.type === 'video' ? (
                  <video src={item.url} className="w-full h-full object-cover" muted loop onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} />
                ) : (
                  <img src={item.url} alt="Portfolio" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-center items-center gap-4">
                   <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                      <FaExpand className="text-white" />
                   </div>
                </div>
              </motion.div>
            ))}
          </Masonry>
        )}
      </div>

      {/* 🎬 PREMIUM SLIDING VIEWER */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center p-4 md:p-10"
          >
             {/* Close Button */}
             <button className="absolute top-6 right-6 md:top-10 md:right-10 z-[1001] w-12 h-12 bg-white/10 hover:bg-red-500 rounded-full flex items-center justify-center transition-all shadow-xl" onClick={() => setSelectedIndex(null)}>
                <div className="text-3xl font-light">×</div>
             </button>

             {/* Navigation Buttons */}
             <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 md:left-10 z-[1001] w-14 h-14 bg-white/5 hover:bg-brand-blue rounded-full flex items-center justify-center transition-all backdrop-blur-md border border-white/5">
                <FaChevronLeft size={24} />
             </button>
             <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 md:right-10 z-[1001] w-14 h-14 bg-white/5 hover:bg-brand-blue rounded-full flex items-center justify-center transition-all backdrop-blur-md border border-white/5">
                <FaChevronRight size={24} />
             </button>

             {/* Counter */}
             <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[1001] bg-black/60 px-6 py-2 rounded-full font-black text-xs tracking-widest border border-white/10 backdrop-blur-md">
                {selectedIndex + 1} / {filteredMedia.length}
             </div>

             <div className="w-full h-full flex flex-col items-center justify-center gap-6 max-w-6xl mx-auto" onClick={() => setSelectedIndex(null)}>
                <motion.div 
                  key={selectedItem._id}
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  className="relative w-full h-[70vh] md:h-[75vh] flex items-center justify-center"
                  onClick={e => e.stopPropagation()}
                >
                   {selectedItem.type === 'video' ? (
                     <video src={selectedItem.url} controls autoPlay className="max-h-full max-w-full rounded-2xl md:rounded-[3rem] shadow-2xl shadow-brand-blue/20" />
                   ) : (
                     <img src={selectedItem.url} className="max-h-full max-w-full object-contain rounded-2xl md:rounded-[3rem] shadow-2xl shadow-brand-blue/20" />
                   )}
                </motion.div>

                <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 px-6" onClick={e => e.stopPropagation()}>
                   <div className="text-center md:text-left">
                      <span className="text-brand-blue font-black uppercase tracking-[0.3em] text-[0.6rem] mb-2 block">{selectedItem.category}</span>
                      <h3 className="text-2xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
                        {selectedItem.tags?.length > 0 ? selectedItem.tags.join(' • ') : 'UNTITLED SHOT'}
                      </h3>
                   </div>
                   
                   <button 
                      onClick={async () => {
                        const res = await fetch(selectedItem.url);
                        const blob = await res.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `SBS_Gallery_${Date.now()}.jpg`;
                        a.click();
                      }}
                      className="btn-premium bg-brand-blue text-white px-10 py-5 flex items-center gap-3 shadow-2xl shadow-brand-blue/30"
                   >
                      <FaDownload /> DOWNLOAD
                   </button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;
