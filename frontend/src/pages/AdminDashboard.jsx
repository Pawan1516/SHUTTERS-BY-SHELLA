import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LayoutDashboard, Image as ImageIcon, LogOut, Upload, Plus, Globe, BarChart2, Star, Check, Trash2, X, MessageSquare, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';

const AdminDashboard = () => {
  const { admin, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ media: 0, visitors: 0, reviews: 0 });
  const [media, setMedia] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [uploadData, setUploadData] = useState({ category: 'Wedding', tags: '', file: null, preview: null });

  useEffect(() => {
    if (admin) fetchAllData();
  }, [admin]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${admin.token}` } };
      const [mRes, vRes, rRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/media`),
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/visitors`),
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews/all`, config)
      ]);
      setMedia(mRes.data);
      setStats({ media: mRes.data.length, visitors: vRes.data.count, reviews: rRes.data.length });
      setReviews(rRes.data);
    } catch (err) {}
    setLoading(false);
  };

  const onDrop = useCallback(files => {
    const file = files[0];
    if (file) setUploadData(prev => ({ ...prev, file, preview: URL.createObjectURL(file) }));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false });

  const onMediaSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData();
    formData.append('file', uploadData.file);
    formData.append('category', uploadData.category);
    try {
      const config = { 
        headers: { Authorization: `Bearer ${admin.token}` },
        onUploadProgress: (p) => setProgress(Math.round((p.loaded * 100) / p.total))
      };
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/media`, formData, config);
      setUploadData({ category: 'Wedding', tags: '', file: null, preview: null });
      fetchAllData();
      alert('Upload Successful!');
      setActiveTab('gallery');
    } catch (err) {}
    setUploading(false);
    setProgress(0);
  };

  const updateReviewStatus = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${admin.token}` } };
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews/${id}/status`, { status }, config);
      fetchAllData();
    } catch (err) {}
  };

  const deleteReview = async (id) => {
    if (!window.confirm('Delete review?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${admin.token}` } };
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews/${id}`, config);
      fetchAllData();
    } catch (err) {}
  };

  const deleteMedia = async (id) => {
    if (!window.confirm('Are you sure you want to delete this visual?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${admin.token}` } };
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/media/${id}`, config);
      fetchAllData();
      alert('Visual Deleted');
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (!admin) return <Navigate to="/admin" />;

  return (
    <div className="min-h-screen bg-[#020617] text-white pb-32">
      
      {/* 📱 MOBILE APP HEADER */}
      <header className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 p-6 flex justify-between items-center">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center font-black">S</div>
            <h1 className="font-black uppercase italic tracking-tighter">Admin <span className="text-brand-blue">App</span></h1>
         </div>
         <button onClick={logout} className="p-2 bg-red-500/10 text-red-500 rounded-lg"><LogOut size={20}/></button>
      </header>

      {/* 📱 MAIN APP CONTENT */}
      <main className="p-6 md:p-12">
        
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} key="dash">
               <h2 className="text-4xl font-black mb-8 uppercase italic italic">Insights</h2>
               <div className="grid grid-cols-2 gap-4">
                  <AppStat icon={<BarChart2/>} label="Visuals" val={stats.media} />
                  <AppStat icon={<Globe/>} label="Reach" val={stats.visitors} />
                  <AppStat icon={<Star/>} label="Reviews" val={stats.reviews} />
                  <AppStat icon={<MessageSquare/>} label="Pending" val={reviews.filter(r => r.status === 'pending').length} />
               </div>
               <div className="mt-8 p-6 bg-brand-blue/10 border border-brand-blue/20 rounded-3xl">
                  <p className="text-[0.6rem] font-bold text-white/50 leading-relaxed uppercase tracking-widest">
                    Your platform is live. Check the "Reviews" tab to approve new stories from your clients.
                  </p>
               </div>
            </motion.div>
          )}

          {activeTab === 'upload' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key="upload" className="max-w-xl mx-auto">
               <h2 className="text-4xl font-black mb-8 uppercase italic">Add <span className="text-brand-blue">New</span></h2>
               <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
                  <div {...getRootProps()} className="border-4 border-dashed border-white/5 rounded-3xl p-10 text-center mb-8">
                     <input {...getInputProps()} />
                     {uploadData.preview ? (
                        <img src={uploadData.preview} className="max-h-40 mx-auto rounded-xl shadow-2xl" />
                     ) : (
                        <div className="space-y-4">
                           <div className="w-16 h-16 bg-brand-blue/20 rounded-full flex items-center justify-center mx-auto"><Plus className="text-brand-blue" /></div>
                           <p className="font-black uppercase italic">Tap to Select Visual</p>
                        </div>
                     )}
                  </div>
                  <form onSubmit={onMediaSubmit} className="space-y-6">
                     <select className="input-field" value={uploadData.category} onChange={e => setUploadData({...uploadData, category: e.target.value})}>
                        <option>Wedding</option><option>Events</option><option>Portraits</option><option>Pre-wedding</option>
                     </select>
                     {uploading && (
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden"><motion.div className="h-full bg-brand-blue shadow-[0_0_10px_#0066cc]" animate={{ width: `${progress}%` }} /></div>
                     )}
                     <button className="btn-premium w-full bg-brand-blue text-white py-5 shadow-xl shadow-brand-blue/30">UPLOAD TO CLOUD</button>
                  </form>
               </div>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="rev">
               <h2 className="text-4xl font-black mb-8 uppercase italic">Reviews</h2>
               <div className="space-y-4">
                  {reviews.map(r => (
                    <div key={r._id} className="bg-white/5 p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
                       <div className="flex justify-between items-start">
                          <div>
                             <h4 className="font-black text-sm uppercase">{r.name}</h4>
                             <p className="text-[0.6rem] text-brand-blue/60 font-bold lowercase tracking-widest">{r.email}</p>
                             <div className="flex text-brand-blue text-[0.6rem] mt-1">{'★'.repeat(r.rating)}</div>
                          </div>
                          <span className={`text-[0.5rem] px-3 py-1 rounded-full font-bold uppercase tracking-widest ${r.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                             {r.status}
                          </span>
                       </div>
                       <p className="text-xs text-white/40 italic">"{r.message}"</p>
                       <div className="flex gap-2">
                          {r.status === 'pending' && (
                            <button onClick={() => updateReviewStatus(r._id, 'approved')} className="flex-1 bg-emerald-500/20 text-emerald-400 py-3 rounded-xl text-[0.6rem] font-bold uppercase tracking-widest border border-emerald-500/20">APPROVE</button>
                          )}
                          <button onClick={() => deleteReview(r._id)} className="flex-1 bg-red-500/20 text-red-500 py-3 rounded-xl text-[0.6rem] font-bold uppercase tracking-widest border border-red-500/20">DELETE</button>
                       </div>
                    </div>
                  ))}
                  {reviews.length === 0 && <p className="text-center text-white/20 uppercase font-bold text-[0.6rem] py-20">No reviews found.</p>}
               </div>
            </motion.div>
          )}

          {activeTab === 'gallery' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key="gallery">
               <h2 className="text-4xl font-black mb-8 uppercase italic">Visuals</h2>
               <div className="grid grid-cols-2 gap-3">
                  {media.map(m => (
                    <div key={m._id} className="aspect-square bg-white/5 rounded-2xl overflow-hidden border border-white/5 group relative">
                       <img src={m.url} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                          <button onClick={() => deleteMedia(m._id)} className="p-3 bg-red-500 rounded-xl hover:scale-110 transition-all"><Trash2 size={16}/></button>
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 📱 MOBILE TAB BAR (APP STYLE) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-2xl border-t border-white/5 px-4 py-4 flex justify-around items-center z-[100]">
         <TabItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard/>} label="Dash" />
         <TabItem active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} icon={<MessageSquare/>} label="Reviews" />
         <TabItem active={activeTab === 'upload'} onClick={() => setActiveTab('upload')} icon={<Plus className="bg-brand-blue rounded-full p-2" size={40}/>} label="Add" hideLabel />
         <TabItem active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} icon={<ImageIcon/>} label="Items" />
         <TabItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings/>} label="Meta" />
      </nav>
    </div>
  );
};

const AppStat = ({ icon, label, val }) => (
  <div className="flex flex-col gap-3 bg-white/5 p-5 rounded-3xl border border-white/5">
     <div className="w-10 h-10 bg-brand-blue/20 rounded-xl flex items-center justify-center text-brand-blue">{icon}</div>
     <div>
        <h3 className="text-2xl font-black italic">{val}</h3>
        <p className="text-[0.5rem] font-bold text-white/30 uppercase tracking-widest">{label}</p>
     </div>
  </div>
);

const TabItem = ({ active, onClick, icon, label, hideLabel }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 flex-1 transition-all ${active ? 'text-brand-blue scale-110' : 'text-white/20'}`}>
     {icon}
     {!hideLabel && <span className="text-[0.5rem] font-bold uppercase tracking-widest">{label}</span>}
  </button>
);

export default AdminDashboard;
