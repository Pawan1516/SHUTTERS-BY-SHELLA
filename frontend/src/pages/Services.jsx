import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHeart, FaCalendarAlt, FaUserAlt, FaCameraRetro } from 'react-icons/fa';

const SERVICES = [
  { 
    id: 'marriage', 
    title: 'Marriage Photography', 
    desc: 'Capturing the eternal bond of souls in cinematic grandeur.',
    icon: <FaHeart />,
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000',
    category: 'Wedding' // Maps to DB category
  },
  { 
    id: 'events', 
    title: 'Event Photography', 
    desc: 'From gala nights to corporate events, we cover it all.',
    icon: <FaCalendarAlt />,
    img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2000',
    category: 'Events'
  },
  { 
    id: 'portraits', 
    title: 'Portrait Photography', 
    desc: 'Professional solo captures that highlight your personality.',
    icon: <FaUserAlt />,
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2000',
    category: 'Portraits'
  },
  { 
    id: 'pre-wedding', 
    title: 'Pre-Wedding Shoots', 
    desc: 'Romantic visual stories before you say I Do.',
    icon: <FaCameraRetro />,
    img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2000',
    category: 'Pre-wedding'
  }
];

const Services = () => {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-brand-blue font-bold tracking-[0.4em] uppercase text-xs mb-4 block">Professional Expertise</span>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic italic">Our <span className="text-brand-blue not-italic">Services</span></h1>
          <p className="text-white/40 mt-6 max-w-2xl mx-auto font-medium">Choose a category to explore our specialized work and cinematic captures tailored for your unique moments.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative h-[400px] overflow-hidden rounded-[2.5rem] border border-white/10"
            >
               <img src={service.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-50" alt={service.title} />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-12 flex flex-col justify-end">
                  <div className="w-16 h-16 bg-brand-blue/20 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-3xl text-brand-blue mb-6 group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white transition-all">
                    {service.icon}
                  </div>
                  <h2 className="text-4xl font-black uppercase italic mb-4">{service.title}</h2>
                  <p className="text-white/50 text-sm mb-8 leading-relaxed max-w-xs">{service.desc}</p>
                  
                  <Link 
                    to={`/services/${service.category}`} 
                    className="btn-premium bg-white text-black hover:bg-brand-blue hover:text-white w-fit px-8"
                  >
                    VIEW {service.id.toUpperCase()} GALLERY
                  </Link>
               </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
