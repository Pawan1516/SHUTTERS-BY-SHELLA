import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { trackClick } from '../utils/analytics';
import axios from 'axios';

const WhatsAppButton = () => {
  const [settings, setSettings] = useState({ whatsapp: '9000092018', message: 'Hi Seenu Shella, I want to book a shoot.', enabled: true });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/settings`);
        setSettings({
          whatsapp: data.whatsappNumber || '9000092018',
          message: data.whatsappMessage || 'Hi Seenu Shella, I want to book a shoot.',
          enabled: data.enableWhatsappButton ?? true
        });
      } catch (err) {}
    };
    fetchSettings();
  }, []);

  if (!settings.enabled || window.innerWidth < 768) return null;

  const handleClick = () => {
    trackClick('whatsapp');
  };

  const fullNumber = settings.whatsapp.startsWith('91') ? settings.whatsapp : `91${settings.whatsapp}`;

  return (
    <a 
      href={`https://wa.me/${fullNumber}?text=${encodeURIComponent(settings.message)}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="pulse text-glow"
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        backgroundColor: '#25D366',
        color: '#fff',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
        zIndex: 1000,
        transition: 'all 0.3s'

      }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1) translateY(0)'}
    >
      <FaWhatsapp />
    </a>
  );
};

export default WhatsAppButton;
