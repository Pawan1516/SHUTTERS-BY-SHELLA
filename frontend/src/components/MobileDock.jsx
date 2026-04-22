import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaPhoneAlt, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { trackClick } from '../utils/analytics';

const MobileDock = () => {
  const [settings, setSettings] = useState({ whatsapp: '9000092018', phone: '9000092018', enableCall: true, enableWA: true });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/settings`);
        setSettings({
            whatsapp: data.whatsappNumber || '9000092018',
            phone: data.phoneNumber || '9000092018',
            enableCall: data.enableCallButton ?? true,
            enableWA: data.enableWhatsappButton ?? true
        });
      } catch (err) {}
    };
    fetchSettings();
  }, []);

  const whatsappLink = `https://wa.me/${settings.whatsapp.startsWith('91') ? settings.whatsapp : `91${settings.whatsapp}`}`;

  return (
    <div className="mobile-only" style={{
      position: 'fixed',
      bottom: '1.5rem',
      left: '1rem',
      right: '1rem',
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '0.8rem',
      zIndex: 1000,
      borderRadius: '50px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
    }}>
      {settings.enableCall && (
        <a href={`tel:${settings.phone}`} onClick={() => trackClick('call')} style={dockItemStyle}>
          <div style={iconCircle}><FaPhoneAlt size={16} /></div>
          <span style={labelStyle}>Call</span>
        </a>
      )}
      
      <Link to="/book" style={{...dockItemStyle, background: 'var(--accent-blue)', borderRadius: '50px', padding: '0.6rem 2rem', flex: '2', color: '#fff', boxShadow: '0 0 15px var(--accent-glow)'}}>
        <FaCalendarAlt size={18} />
        <span style={{...labelStyle, fontWeight: '900'}}>BOOK NOW</span>
      </Link>

      {settings.enableWA && (
        <a href={whatsappLink} target="_blank" rel="noreferrer" onClick={() => trackClick('whatsapp')} style={dockItemStyle}>
          <div style={{...iconCircle, background: 'linear-gradient(45deg, #25D366, #128C7E)'}}><FaWhatsapp size={20} /></div>
          <span style={labelStyle}>Chat</span>
        </a>
      )}
    </div>
  );
};

const iconCircle = {
  width: '35px',
  height: '35px',
  borderRadius: '50%',
  background: 'rgba(255,255,255,0.05)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '4px'
};

const dockItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--text-main)',
  textDecoration: 'none',
  flex: 1
};

const labelStyle = {
  fontSize: '0.6rem',
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  fontWeight: '700'
};

export default MobileDock;
