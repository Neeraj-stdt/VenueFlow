import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBuilding, FaSignOutAlt, FaCheck, FaTimes, FaTrash, FaExclamationCircle, FaClock, FaCheckCircle, FaUserPlus, FaUsers, FaKey } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Modal State for creating a new club
  const [showClubModal, setShowClubModal] = useState(false);
  const [newClub, setNewClub] = useState({ name: '', email: '', password: '' });

  const [bookings, setBookings] = useState([
    {
      id: 1,
      club: 'Tech Club',
      title: 'CSE AI Workshop',
      date: 'Tomorrow',
      time: '10:00 AM - 01:00 PM',
      status: 'APPROVED',
      venue: 'GEHU Main Auditorium',
      desc: 'Hands-on AI and Machine Learning session.'
    },
    {
      id: 2,
      club: 'Cultural Committee',
      title: 'Web Dev Bootcamp',
      date: 'Next Week',
      time: '02:00 PM - 05:00 PM',
      status: 'PENDING',
      venue: 'Computer Lab 4',
      desc: 'React and Tailwind CSS basics.'
    },
    {
      id: 3,
      club: 'Sports Club',
      title: 'Indoor Chess Tournament',
      date: 'Next Friday',
      time: '09:00 AM - 04:00 PM',
      status: 'PENDING',
      venue: 'Seminar Hall A',
      desc: 'Inter-department chess championship.'
    }
  ]);

  // --- Dynamic Club State ---
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'clubs'
  const [clubs, setClubs] = useState(() => {
    const saved = localStorage.getItem('officialClubs');
    return saved ? JSON.parse(saved) : [{ id: 1, name: 'Tech Club', email: 'techclub@gehu.edu', members: 42, joined: '2023-08-15' }];
  });

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('venueUser'));
    if (!loggedInUser || loggedInUser.role !== 'ADMIN') {
      navigate('/login');
    } else {
      setUser(loggedInUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('venueUser');
    toast.success('System logged out securely');
    navigate('/login');
  };

  // --- Admin Action Handlers ---
  const handleApprove = (id) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'APPROVED' } : b));
    toast.success('Booking Approved! Venue is now locked.');
  };

  const handleReject = (id) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'REJECTED' } : b));
    toast.error('Booking Request Rejected.');
  };

  const handleRevoke = (id) => {
    if(window.confirm("CRITICAL WARNING: Are you sure you want to revoke this approved booking? The club will be notified.")) {
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'REJECTED' } : b));
      toast.success('Access Revoked. Venue is now available again.');
    }
  };

  const handleCreateClub = (e) => {
    e.preventDefault();
    
    if (clubs.some(c => c.email === newClub.email)) {
      toast.error('A club with this email already exists!');
      return;
    }

    const clubToSave = {
      id: Date.now(),
      name: newClub.name,
      email: newClub.email,
      password: newClub.password, 
      members: Math.floor(Math.random() * 50) + 10, 
      joined: new Date().toISOString().split('T')[0]
    };

    const updatedClubs = [...clubs, clubToSave];
    setClubs(updatedClubs);
    localStorage.setItem('officialClubs', JSON.stringify(updatedClubs)); 
    
    toast.success(`${newClub.name} created successfully!`);
    setShowClubModal(false);
    setNewClub({ name: '', email: '', password: '' }); 
  };

  const handleDeleteClub = (clubId, clubName) => {
    if(window.confirm(`Are you sure you want to permanently delete ${clubName}? All their active bookings will be canceled.`)) {
      const updatedClubs = clubs.filter(c => c.id !== clubId);
      setClubs(updatedClubs);
      localStorage.setItem('officialClubs', JSON.stringify(updatedClubs));
      toast.success(`${clubName} has been removed from the system.`);
    }
  };
  
  if (!user) return null;

  const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
  const approvedCount = bookings.filter(b => b.status === 'APPROVED').length;

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      
      {/* PREMIUM SIDEBAR */}
      <div className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl z-20 relative">
        <div className="p-8 border-b border-slate-800">
          <h2 className="text-2xl font-extrabold flex items-center gap-3 text-white">
            <FaBuilding className="text-red-500 text-3xl drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" /> 
            Smart Venue
          </h2>
          <p className="text-red-400 text-sm mt-2 font-medium bg-red-500/10 inline-block px-3 py-1 rounded-full">{user.name}</p>
        </div>
        
        <div className="flex-1 p-6 space-y-5">
          {/* Animated Stat Cards */}
          <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-slate-800 to-slate-800/50 p-5 rounded-2xl border border-slate-700/50 shadow-lg relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-slate-700/30 text-7xl"><FaClock /></div>
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1 relative z-10">Pending Requests</h3>
            <p className="text-4xl font-black text-yellow-500 relative z-10 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">{pendingCount}</p>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-slate-800 to-slate-800/50 p-5 rounded-2xl border border-slate-700/50 shadow-lg relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-slate-700/30 text-7xl"><FaCheckCircle /></div>
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1 relative z-10">Approved Events</h3>
            <p className="text-4xl font-black text-green-500 relative z-10 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">{approvedCount}</p>
          </motion.div>

          {/* VIEW TOGGLES (This was missing!) */}
          <div className="flex bg-slate-800 p-1.5 rounded-xl mt-6">
            <button 
              onClick={() => setActiveTab('bookings')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'bookings' ? 'bg-slate-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
            >
              Queue
            </button>
            <button 
              onClick={() => setActiveTab('clubs')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'clubs' ? 'bg-slate-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
            >
              Clubs ({clubs.length})
            </button>
          </div>

          {/* Admin Tool to create clubs */}
          <div className="pt-4 mt-2 border-t border-slate-800">
             <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowClubModal(true)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border border-slate-700 shadow-lg"
            >
              <FaUserPlus className="text-blue-400 text-lg" /> Add New Club
            </motion.button>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-red-400 transition-colors font-semibold w-full px-4 py-2 hover:bg-red-500/10 rounded-lg">
            <FaSignOutAlt /> System Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 overflow-y-auto relative">
        <div className="max-w-6xl mx-auto">
          
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {activeTab === 'bookings' ? 'Master Booking Queue' : 'Club Management'}
            </h1>
            <p className="text-slate-500 mt-1 font-medium">
              {activeTab === 'bookings' ? 'Review, approve, or revoke venue requests in real-time.' : 'Manage officially registered campus clubs and organizations.'}
            </p>
          </div>
          
          <div className="space-y-4">
            
            {/* BOOKINGS VIEW (Conditional Render) */}
            {activeTab === 'bookings' && (
              <AnimatePresence>
                {bookings.map((booking, index) => (
                  <motion.div 
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    layout 
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-xl hover:border-slate-300"
                  >
                    {/* Event Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                          booking.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200 shadow-[0_0_10px_rgba(34,197,94,0.2)]' :
                          booking.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 shadow-[0_0_10px_rgba(234,179,8,0.2)]' :
                          'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {booking.status}
                        </span>
                        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{booking.club}</span>
                      </div>
                      
                      <h3 className="text-xl font-extrabold text-slate-800 mb-2">{booking.title}</h3>
                      
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-500">
                        <p className="flex items-center gap-1.5"><FaBuilding className="text-slate-400" /> {booking.venue}</p>
                        <p className="flex items-center gap-1.5"><FaClock className="text-slate-400" /> {booking.date} • {booking.time}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 shrink-0">
                      {booking.status === 'PENDING' && (
                        <>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleApprove(booking.id)}
                            className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-green-500/30"
                          >
                            <FaCheck /> Approve
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleReject(booking.id)}
                            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-2 transition-colors border border-slate-200"
                          >
                            <FaTimes /> Reject
                          </motion.button>
                        </>
                      )}

                      {booking.status === 'APPROVED' && (
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRevoke(booking.id)}
                          className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl flex items-center gap-2 transition-colors border border-red-200 shadow-sm"
                        >
                          <FaExclamationCircle /> Revoke Access
                        </motion.button>
                      )}

                      {booking.status === 'REJECTED' && (
                        <span className="text-slate-400 text-sm font-bold flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                          <FaTrash /> Discarded
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {/* CLUBS MANAGEMENT VIEW (Conditional Render) */}
            {activeTab === 'clubs' && (
              <AnimatePresence>
                {clubs.map((club, index) => (
                  <motion.div 
                    key={club.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl hover:border-blue-300 transition-all"
                  >
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                        <FaUsers className="text-blue-500" /> {club.name}
                      </h3>
                      <p className="text-slate-500 font-medium mt-1">{club.email}</p>
                      <div className="flex gap-4 mt-3 text-sm text-slate-400">
                        <span className="bg-slate-50 px-3 py-1 rounded-full border border-slate-100">Members: <strong className="text-slate-700">{club.members}</strong></span>
                        <span className="bg-slate-50 px-3 py-1 rounded-full border border-slate-100">Joined: <strong className="text-slate-700">{club.joined}</strong></span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0 mt-4 md:mt-0">
                      <button 
                        onClick={() => toast("Password reset link sent to club email.", { icon: '📧' })}
                        className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors flex items-center gap-2"
                      >
                        <FaKey /> Reset Password
                      </button>
                      <button 
                        onClick={() => handleDeleteClub(club.id, club.name)}
                        className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl flex items-center gap-2 transition-colors border border-red-200"
                      >
                        <FaTrash /> Revoke Club
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

          </div>
        </div>
      </div>

      {/* CREATE CLUB MODAL */}
      <AnimatePresence>
        {showClubModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
            >
              <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Register Official Club</h2>
                  <p className="text-slate-400 text-xs mt-1">Generate access credentials below.</p>
                </div>
                <button onClick={() => setShowClubModal(false)} className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition-colors">
                  <FaTimes />
                </button>
              </div>
              
              <form onSubmit={handleCreateClub} className="p-8 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Official Club Name</label>
                  <input type="text" required value={newClub.name} onChange={e => setNewClub({...newClub, name: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium" placeholder="e.g. Robotics Society" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Club Email Address</label>
                  <input type="email" required value={newClub.email} onChange={e => setNewClub({...newClub, email: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium" placeholder="robotics@gehu.edu" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Temporary Password</label>
                  <input type="text" required value={newClub.password} onChange={e => setNewClub({...newClub, password: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium" placeholder="Provide an initial password" />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setShowClubModal(false)} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-900/30 transition-all flex items-center gap-2">
                    <FaUserPlus /> Create Account
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminDashboard;