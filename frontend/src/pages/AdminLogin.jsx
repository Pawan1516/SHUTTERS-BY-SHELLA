import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ChevronRight } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setError(res.error || 'Invalid Credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
           <div className="w-16 h-16 bg-brand-blue rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-blue/30 font-black text-2xl rotate-3">S</div>
           <h1 className="text-4xl font-black uppercase italic tracking-tighter">Admin <span className="text-brand-blue">Access</span></h1>
           <p className="text-white/30 uppercase tracking-[0.4em] text-[0.6rem] font-bold mt-2">Authorized Personnel Only</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[0.6rem] font-black uppercase tracking-widest text-white/40 ml-4">Email Address</label>
                 <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18}/>
                    <input 
                      type="email" 
                      className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 pl-14 outline-none focus:border-brand-blue transition-all font-bold text-sm"
                      placeholder="admin@seenushella.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[0.6rem] font-black uppercase tracking-widest text-white/40 ml-4">Security Password</label>
                 <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18}/>
                    <input 
                      type="password" 
                      className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 pl-14 outline-none focus:border-brand-blue transition-all font-bold text-sm"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                 </div>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-[0.65rem] font-bold uppercase tracking-widest text-center bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                  {error}
                </motion.div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="btn-premium w-full bg-brand-blue text-white py-5 shadow-2xl shadow-brand-blue/40 flex items-center justify-center gap-3 group"
              >
                {loading ? 'Authenticating...' : 'SIGN IN SYSTEM'}
                <ChevronRight className="group-hover:translate-x-2 transition-transform" size={18}/>
              </button>
           </form>
        </div>

        <div className="text-center mt-10">
           <button onClick={() => navigate('/')} className="text-white/20 text-[0.6rem] font-bold uppercase tracking-widest hover:text-brand-blue transition-all">Back to Public Site</button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
