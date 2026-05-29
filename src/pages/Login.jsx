import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUserShield, FaUsers, FaBuilding } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Login = () => {
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (isAdminLogin) {
      if (email === 'admin@gehu.edu' && password === 'admin123') {
        localStorage.setItem('venueUser', JSON.stringify({ role: 'ADMIN', name: 'System Administrator' }));
        toast.success('Welcome back, Admin!');
        setTimeout(() => navigate('/admin-dashboard'), 1000);
      } else {
        toast.error('Invalid Admin Credentials.');
      }
    } else {
      // 1. Fetch clubs from local storage (or use default if empty)
      const storedClubs = JSON.parse(localStorage.getItem('officialClubs')) || [
        { name: 'Tech Club', email: 'techclub@gehu.edu', password: 'club123', members: 42 }
      ];

      // 2. Check if the entered credentials match ANY club in the array
      const validClub = storedClubs.find(club => club.email === email && club.password === password);

      if (validClub) {
        localStorage.setItem('venueUser', JSON.stringify({ role: 'CLUB', name: validClub.name }));
        toast.success(`Welcome, ${validClub.name}!`);
        setTimeout(() => navigate('/club-dashboard'), 1000);
      } else {
        toast.error('Invalid Club Credentials.');
      }
    }
  };

  return (
    // THE FIX: Using reliable, standard Tailwind classes for a dark background
    <div className="min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Decorative background blurs (now explicitly colored so they show up) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-red-500/20 rounded-full blur-3xl"></div>

      {/* Floating Glassmorphism Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full bg-slate-800/40 backdrop-blur-xl border border-slate-600/50 rounded-3xl shadow-2xl overflow-hidden z-10"
      >
        
        {/* Header */}
        <div className="p-8 text-center relative overflow-hidden">
          <div className="flex justify-center mb-4 text-blue-400">
            <FaBuilding className="text-5xl drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">VenueFlow</h1>
          <p className="text-blue-200/80 text-sm mt-2 font-medium">Graphic Era Venue Booking</p>
        </div>

        {/* Custom Tab Switcher */}
        <div className="flex px-8 pb-6 gap-4">
          <button
            onClick={() => setIsAdminLogin(false)}
            className={`flex-1 py-3 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
              !isAdminLogin ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FaUsers /> Club
          </button>
          <button
            onClick={() => setIsAdminLogin(true)}
            className={`flex-1 py-3 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
              isAdminLogin ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FaUserShield /> Admin
          </button>
        </div>

        {/* Form Container */}
        <div className="px-8 pb-8">
          <AnimatePresence mode="wait">
            <motion.form 
              key={isAdminLogin ? 'admin' : 'club'} 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleLogin} 
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 w-full p-3.5 bg-slate-900/60 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-slate-500"
                    placeholder={isAdminLogin ? "admin@gehu.edu" : "techclub@gehu.edu"}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 w-full p-3.5 bg-slate-900/60 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-slate-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className={`w-full text-white p-4 rounded-xl font-bold text-lg transition-all flex justify-center items-center gap-2 mt-4 shadow-lg ${
                  isAdminLogin ? 'bg-gradient-to-r from-red-600 to-red-500 hover:shadow-red-500/25' : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:shadow-blue-500/25'
                }`}
              >
                Sign In {isAdminLogin ? <FaUserShield /> : <FaUsers />}
              </motion.button>
            </motion.form>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;