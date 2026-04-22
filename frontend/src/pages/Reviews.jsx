import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FaStar, FaQuoteLeft, FaCheckCircle, FaUserCircle } from 'react-icons/fa';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', rating: 5, message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchApprovedReviews();
  }, []);

  const fetchApprovedReviews = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews`);
      setReviews(data);
    } catch (err) {}
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews`, formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', rating: 5, message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      alert('Failed to submit review');
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-brand-blue font-bold tracking-[0.4em] uppercase text-[0.6rem] mb-4 block">Kind Words</span>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic italic">Client <span className="text-brand-blue not-italic">Love</span></h1>
          <p className="text-white/30 mt-6 max-w-xl mx-auto font-medium uppercase text-[0.6rem] tracking-[0.2em]">Read stories from families and couples who trusted us with their most precious moments.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left: Reviews List */}
          <div className="space-y-6">
            {loading ? (
               [1,2,3].map(i => <div key={i} className="h-40 bg-white/5 rounded-3xl animate-pulse" />)
            ) : (
              reviews.map((rev, i) => (
                <motion.div 
                  key={rev._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-10 relative overflow-hidden"
                >
                  <FaQuoteLeft className="absolute top-6 right-8 text-brand-blue/10 text-6xl" />
                  <div className="flex text-brand-blue mb-4 gap-1">
                    {[...Array(rev.rating)].map((_, i) => <FaStar key={i} size={14}/>)}
                  </div>
                  <p className="text-white/60 mb-8 italic leading-relaxed">"{rev.message}"</p>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/30 font-black italic">
                        {rev.name.charAt(0)}
                     </div>
                     <div>
                        <h4 className="font-black uppercase tracking-widest text-xs">{rev.name}</h4>
                        <p className="text-[0.5rem] text-white/20 font-bold lowercase tracking-widest">{rev.email}</p>
                     </div>
                  </div>
                </motion.div>
              ))
            )}
            {reviews.length === 0 && !loading && (
              <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                <p className="text-white/20 uppercase font-bold text-xs tracking-widest">No stories shared yet.</p>
              </div>
            )}
          </div>

          {/* Right: Submit Review Form */}
          <div className="sticky top-40">
             <div className="glass-card p-10 md:p-12 border-brand-blue/30 bg-brand-blue/5">
                <h3 className="text-3xl font-black uppercase italic mb-8">Share Your <span className="text-brand-blue">Story</span></h3>
                <AnimatePresence>
                  {submitted ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                       <FaCheckCircle className="text-emerald-400 text-6xl mx-auto mb-6" />
                       <h4 className="text-xl font-bold uppercase mb-2">Thank You!</h4>
                       <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Your review has been sent for approval.</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[0.6rem] font-black uppercase tracking-widest text-white/30 ml-4">Full Name</label>
                          <input 
                            required
                            type="text" 
                            className="input-field" 
                            placeholder="YOUR NAME" 
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                          />
                       </div>

                       <div className="space-y-2">
                          <label className="text-[0.6rem] font-black uppercase tracking-widest text-white/30 ml-4">Email Address</label>
                          <input 
                            required
                            type="email" 
                            className="input-field" 
                            placeholder="EMAIL@EXAMPLE.COM" 
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                          />
                       </div>

                       <div className="space-y-2">
                          <label className="text-[0.6rem] font-black uppercase tracking-widest text-white/30 ml-4">Rating</label>
                          <div className="flex gap-4 bg-black/40 p-4 rounded-2xl border border-white/5 justify-center">
                             {[1,2,3,4,5].map(star => (
                               <button 
                                 key={star}
                                 type="button"
                                 onClick={() => setFormData({...formData, rating: star})}
                                 className={`text-2xl transition-all ${formData.rating >= star ? 'text-brand-blue scale-125' : 'text-white/10'}`}
                               >
                                 ★
                               </button>
                             ))}
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="text-[0.6rem] font-black uppercase tracking-widest text-white/30 ml-4">Your Experience</label>
                          <textarea 
                            required
                            rows="4"
                            className="input-field resize-none" 
                            placeholder="TELL US ABOUT YOUR SHOOT..." 
                            value={formData.message}
                            onChange={e => setFormData({...formData, message: e.target.value})}
                          ></textarea>
                       </div>

                       <button type="submit" className="btn-premium w-full bg-brand-blue text-white py-5 shadow-xl shadow-brand-blue/30">
                          SUBMIT REVIEW
                       </button>
                    </form>
                  )}
                </AnimatePresence>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
