import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaCalendarAlt } from 'react-icons/fa';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/events');
        setEvents(data);
      } catch (err) {}
      setLoading(false);
    };
    fetchEvents();
  }, []);

  return (
    <div className="container page-section" style={{ minHeight: '100vh', paddingTop: '10rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
        <span className="section-subtitle">Event Galleries</span>
        <h1 className="section-title text-glow">Featured <span style={{ color: 'var(--accent-blue)' }}>Events</span></h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>Private and public event galleries customized for every client.</p>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--accent-blue)', fontWeight: '900', letterSpacing: '4px' }}>LOADING GALLERIES...</div>
      ) : events.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No public events available at the moment.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2.5rem' }}>
          {events.map((ev, i) => (
            <motion.div
              key={ev._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={`/events/${ev._id}`} className="glass-card" style={{ padding: 0, overflow: 'hidden', display: 'block', borderRadius: '28px' }}>
                <div style={{ height: '300px', background: '#111', position: 'relative', overflow: 'hidden' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop" 
                    alt={ev.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  {ev.isPrivate && (
                    <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', color: '#fff', padding: '0.6rem 1rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <FaLock size={10} /> PRIVATE ACCESS
                    </div>
                  )}
                </div>
                <div style={{ padding: '2.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--accent-blue)', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.8rem' }}>
                     <FaCalendarAlt /> {new Date(ev.date).toLocaleDateString().toUpperCase()}
                  </div>
                  <h3 style={{ fontSize: '1.5rem', letterSpacing: '1px', marginBottom: '1rem' }}>{ev.title.toUpperCase()}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>{ev.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
