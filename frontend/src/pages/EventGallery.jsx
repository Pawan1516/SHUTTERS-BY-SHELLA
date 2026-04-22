import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import { FaLock, FaMagic, FaQuoteLeft, FaStar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const EventGallery = () => {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [media, setMedia] = useState([]);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadEventData();
  }, [id]);

  const loadEventData = async () => {
    try {
      const { data } = await axios.post(`http://localhost:5000/api/events/${id}/access`, { password });
      setEventData(data.event);
      setMedia(data.media);
      setAuthenticated(true);
      fetchReviews();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setAuthenticated(false);
      } else {
        setError(err.response?.data?.message || 'Error loading event');
      }
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/reviews');
      setReviews(data.filter(r => r.eventId === id && r.status === 'approved'));
    } catch (err) {}
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/reviews', { ...reviewForm, eventId: id });
      setSubmitted(true);
      setReviewForm({ name: '', rating: 5, message: '' });
    } catch (err) {
      alert('Failed to submit review');
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    loadEventData();
  };

  if (!authenticated) {
    return (
      <div className="container page-section" style={{ paddingTop: '10rem', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ maxWidth: '450px', width: '100%', textAlign: 'center', padding: '4rem' }}>
          <div style={{ color: 'var(--accent-blue)', marginBottom: '2rem' }}><FaLock size={50} /></div>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '1rem' }}>PRIVATE GALLERY</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Secure access required for this collection.</p>
          {error && <p style={{ color: 'var(--error)', marginBottom: '1.5rem', fontWeight: 'bold' }}>{error.toUpperCase()}</p>}
          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <input 
              required
              type="password" 
              placeholder="ENTER PASSWORD" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
            <button type="submit" className="btn-premium btn-premium-solid">UNLOCK CONTENT</button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (!eventData) return <div style={{ paddingTop: '15rem', textAlign: 'center', color: 'var(--accent-blue)', fontWeight: '900' }}>INITIALIZING GALLERY...</div>;

  const breakpoints = { default: 3, 1100: 2, 700: 1 };

  return (
    <div className="container page-section fade-in" style={{ paddingTop: '10rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
        <span className="section-subtitle">GALLERY VIEW 2026</span>
        <h1 className="section-title text-glow" style={{ marginBottom: '1.5rem' }}>{eventData.title.toUpperCase()}</h1>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '2px' }}>
            <span>{new Date(eventData.date).toLocaleDateString().toUpperCase()}</span>
            <span style={{ color: 'var(--accent-blue)' }}>|</span>
            <span>{media.length} CAPTURES</span>
        </div>
        <p style={{ maxWidth: '700px', margin: '2rem auto 0', fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>{eventData.description}</p>
      </div>

      <Masonry breakpointCols={breakpoints} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
        {media.map((item, i) => (
          <motion.div 
            key={item._id} 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card"
            style={{ marginBottom: '1.5rem', padding: '0', borderRadius: '16px' }}
          >
            {item.type === 'video' ? (
               <video src={item.url} style={{ width: '100%', display: 'block' }} controls />
            ) : (
               <img src={item.url} alt="Gallery" style={{ width: '100%', display: 'block' }} loading="lazy" />
            )}
          </motion.div>
        ))}
      </Masonry>

      <div style={{ marginTop: '8rem', borderTop: '1px solid var(--glass-border)', paddingTop: '6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="section-subtitle">FEEDBACK</span>
            <h2 className="section-title" style={{ fontSize: '3rem' }}>EVENT REVIEWS</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem' }}>
          {/* Submit Review */}
          <div className="glass-card" style={{ padding: '3.5rem', border: '1px solid var(--accent-blue)' }}>
            <h3 style={{ marginBottom: '2.5rem', fontWeight: '900' }}>SHARE EXPERIENCE</h3>
            {submitted ? (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>✨</div>
                    <p style={{ fontWeight: 'bold', color: 'var(--accent-blue)' }}>THANK YOU FOR SHARING!</p>
                </div>
            ) : (
                <form onSubmit={submitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <input required type="text" placeholder="YOUR NAME" value={reviewForm.name} onChange={e => setReviewForm({...reviewForm, name: e.target.value})} style={inputStyle} />
                    <select value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm, rating: e.target.value})} style={inputStyle}>
                        {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} STARS</option>)}
                    </select>
                    <textarea required placeholder="YOUR MESSAGE..." value={reviewForm.message} onChange={e => setReviewForm({...reviewForm, message: e.target.value})} rows="4" style={inputStyle}></textarea>
                    <button type="submit" className="btn-premium btn-premium-solid"><FaMagic /> POST FEEDBACK</button>
                </form>
            )}
          </div>

          {/* Review List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {reviews.length === 0 ? (
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)' }}>No public feedback yet for this event.</p>
              </div>
            ) : (
              reviews.map(r => (
                <div key={r._id} className="glass-card" style={{ padding: '2.5rem' }}>
                  <FaQuoteLeft style={{ color: 'var(--accent-blue)', opacity: 0.3, marginBottom: '1rem' }} />
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>"{r.message}"</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ letterSpacing: '1px' }}>{r.name.toUpperCase()}</strong>
                    <div style={{ color: 'var(--accent-gold)' }}>{'⭐'.repeat(r.rating)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--glass-border)',
  background: 'rgba(255,255,255,0.02)', color: 'var(--text-main)', fontSize: '0.9rem', width: '100%', outline: 'none',
  textTransform: 'uppercase', letterSpacing: '1px'
};

export default EventGallery;
