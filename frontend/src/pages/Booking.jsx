import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaWhatsapp, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaCalendarCheck } from 'react-icons/fa';

const Booking = () => {
  const [settings, setSettings] = useState({
    phoneNumber: '9000092018',
    whatsappNumber: '9000092018',
    whatsappMessage: 'Hi Seenu Shella, I want to book a shoot.'
  });

  const [formData, setFormData] = useState({
    name: '',
    eventType: 'Wedding',
    date: '',
    location: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/settings`);
        if (data) setSettings(prev => ({ ...prev, ...data }));
      } catch (err) {}
    };
    fetchSettings();
  }, []);

  const handleWhatsApp = (e) => {
    e.preventDefault();
    const msg = `Hi Seenu Shella, I want to book a shoot.\n\nName: ${formData.name}\nEvent Type: ${formData.eventType}\nDate: ${formData.date}\nLocation: ${formData.location}`;
    window.open(`https://wa.me/91${settings.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-brand-blue font-bold tracking-[0.4em] uppercase text-xs mb-4 block">Reservation & Contact</span>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic italic">Book Your <span className="text-brand-blue not-italic">Session</span></h1>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* Left: Contact Info */}
          <div className="space-y-8">
            <div className="glass-card p-10">
               <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-8">Contact Information</h3>
               <div className="space-y-6">
                  <ContactItem icon={<FaPhoneAlt />} label="Phone" val={settings.phoneNumber} />
                  <ContactItem icon={<FaWhatsapp />} label="WhatsApp" val={`+91 ${settings.whatsappNumber}`} />
                  <ContactItem icon={<FaEnvelope />} label="Email" val="contact@seenushella.com" />
                  <ContactItem icon={<FaMapMarkerAlt />} label="Location" val="Hyderabad, India (Global Travel)" />
               </div>
            </div>

            <div className="glass-card p-10 bg-brand-blue/10 border-brand-blue/30">
               <h3 className="text-xl font-bold uppercase mb-4">Direct Booking Flow</h3>
               <p className="text-sm text-white/50 leading-relaxed italic font-bold">
                 Fill out the form to generate your pre-filled WhatsApp message. One click will connect you directly with Seenu Shella for availability and quotes.
               </p>
            </div>
          </div>

          {/* Right: Booking Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-10 md:p-12"
          >
            <form onSubmit={handleWhatsApp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[0.6rem] uppercase tracking-widest font-black text-brand-blue ml-2">Your Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="Enter your full name" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-brand-blue transition-all font-bold text-sm tracking-widest uppercase"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[0.6rem] uppercase tracking-widest font-black text-brand-blue ml-2">Event Category</label>
                <select 
                  className="w-full bg-[#0f172a] border border-white/10 rounded-2xl p-5 outline-none focus:border-brand-blue transition-all font-bold text-sm tracking-widest uppercase appearance-none"
                  value={formData.eventType}
                  onChange={e => setFormData({...formData, eventType: e.target.value})}
                >
                  <option>Wedding</option>
                  <option>Pre-wedding</option>
                  <option>Event</option>
                  <option>Portrait</option>
                  <option>Commercial</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[0.6rem] uppercase tracking-widest font-black text-brand-blue ml-2">Preferred Date</label>
                  <input 
                    required
                    type="date" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-brand-blue transition-all font-bold text-sm tracking-widest"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[0.6rem] uppercase tracking-widest font-black text-brand-blue ml-2">Location</label>
                  <input 
                    required
                    type="text" 
                    placeholder="City / Venue" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-brand-blue transition-all font-bold text-sm tracking-widest uppercase"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>

              <button type="submit" className="btn-premium w-full bg-brand-blue text-white shadow-xl shadow-brand-blue/30 mt-4 group">
                <FaCalendarCheck className="group-hover:rotate-12 transition-transform" /> GENERATE WHATSAPP BOOKING
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const ContactItem = ({ icon, label, val }) => (
  <div className="flex items-center gap-6 group">
    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-brand-blue text-xl group-hover:bg-brand-blue group-hover:text-white transition-all">
      {icon}
    </div>
    <div>
      <div className="text-[0.6rem] uppercase tracking-widest font-black text-white/30 mb-1">{label}</div>
      <div className="font-bold text-lg">{val}</div>
    </div>
  </div>
);

export default Booking;
