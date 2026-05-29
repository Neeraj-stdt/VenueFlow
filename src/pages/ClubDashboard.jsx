import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FaCalendarPlus, FaSignOutAlt, FaBuilding, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const localizer = momentLocalizer(moment);

const ClubDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'CSE AI Workshop',
      start: new Date(moment().add(1, 'days').set({ hour: 10, minute: 0 }).toDate()),
      end: new Date(moment().add(1, 'days').set({ hour: 13, minute: 0 }).toDate()),
      status: 'APPROVED',
      venue: 'GEHU Main Auditorium',
      desc: 'Hands-on AI and Machine Learning session.'
    },
    {
      id: 2,
      title: 'Web Dev Bootcamp',
      start: new Date(moment().add(3, 'days').set({ hour: 14, minute: 0 }).toDate()),
      end: new Date(moment().add(3, 'days').set({ hour: 17, minute: 0 }).toDate()),
      status: 'PENDING',
      venue: 'Computer Lab 4',
      desc: 'React and Tailwind CSS basics.'
    }
  ]);

  const [newEvent, setNewEvent] = useState({ title: '', venue: '', date: '', startTime: '', endTime: '', desc: '' });

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('venueUser'));
    if (!loggedInUser || loggedInUser.role !== 'CLUB') {
      navigate('/login');
    } else {
      setUser(loggedInUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('venueUser');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Color-Coding Logic
  const eventStyleGetter = (event) => {
    let backgroundColor = '#3b82f6'; // Blue-500
    
    if (event.status === 'APPROVED') {
      backgroundColor = '#ef4444'; // Red-500
    } else if (event.status === 'PENDING') {
      backgroundColor = '#eab308'; // Yellow-500
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 0.95,
        color: event.status === 'PENDING' ? '#1e293b' : '#fff',
        border: 'none',
        display: 'block',
        fontWeight: '600',
        padding: '2px 6px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }
    };
  };

  const handleBookVenue = (e) => {
    e.preventDefault();
    
    const startDateTime = new Date(`${newEvent.date}T${newEvent.startTime}`);
    const endDateTime = new Date(`${newEvent.date}T${newEvent.endTime}`);

    const bookingToSave = {
      id: events.length + 1,
      title: newEvent.title,
      start: startDateTime,
      end: endDateTime,
      status: 'PENDING',
      venue: newEvent.venue,
      desc: newEvent.desc
    };

    setEvents([...events, bookingToSave]);
    setShowModal(false);
    setNewEvent({ title: '', venue: '', date: '', startTime: '', endTime: '', desc: '' });
    
    // Sleek Toast instead of ugly alert!
    toast.success("Booking Request Submitted! Awaiting Admin Approval.");
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      
      {/* PREMIUM SIDEBAR */}
      <div className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl z-10 relative">
        <div className="p-8 border-b border-slate-800">
          <h2 className="text-2xl font-extrabold flex items-center gap-3 text-white">
            <FaBuilding className="text-blue-500 text-3xl drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" /> 
            Smart Venue
          </h2>
          <p className="text-blue-400 text-sm mt-2 font-medium bg-blue-500/10 inline-block px-3 py-1 rounded-full">{user.name}</p>
        </div>
        
        <div className="flex-1 p-6">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/30 mb-8"
          >
            <FaCalendarPlus className="text-lg" /> New Booking
          </motion.button>

          <div className="space-y-5 bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Legend</h3>
            <div className="flex items-center gap-3 text-sm font-medium"><span className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span> Booked (Approved)</div>
            <div className="flex items-center gap-3 text-sm font-medium"><span className="w-4 h-4 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]"></span> Pending Approval</div>
            <div className="flex items-center gap-3 text-sm font-medium"><span className="w-4 h-4 rounded-full border-2 border-slate-500 border-dashed"></span> Available Space</div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors font-semibold w-full px-4 py-2 hover:bg-slate-800 rounded-lg">
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </div>

      {/* MAIN CONTENT (CALENDAR) */}
      <div className="flex-1 p-8 overflow-hidden flex flex-col relative">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Venue Availability</h1>
          <p className="text-slate-500 mt-1 font-medium">Click "New Booking" to request a time slot.</p>
        </div>
        
        <div className="flex-1 bg-white p-6 rounded-3xl shadow-xl border border-slate-200/60 z-0">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            eventPropGetter={eventStyleGetter}
            views={['month', 'week', 'day']}
            defaultView="week"
            tooltipAccessor={(event) => `${event.title} - ${event.venue}\n${event.desc}`}
          />
        </div>
      </div>

      {/* ANIMATED BOOKING MODAL */}
      <AnimatePresence>
        {showModal && (
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
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200"
            >
              <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Request Venue</h2>
                  <p className="text-slate-400 text-xs mt-1">Fill out the event details below.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition-colors">
                  <FaTimes />
                </button>
              </div>
              
              <form onSubmit={handleBookVenue} className="p-8 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Event Name</label>
                  <input type="text" required value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium" placeholder="e.g. Annual Tech Symposium" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Venue</label>
                  <select required value={newEvent.venue} onChange={e => setNewEvent({...newEvent, venue: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-700">
                    <option value="">-- Choose Venue --</option>
                    <option value="GEHU Main Auditorium">GEHU Main Auditorium</option>
                    <option value="Seminar Hall A">Seminar Hall A</option>
                    <option value="Computer Lab 1">Computer Lab 1</option>
                    <option value="Open Ground">Open Ground</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date</label>
                    <input type="date" required value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-700" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Start</label>
                      <input type="time" required value={newEvent.startTime} onChange={e => setNewEvent({...newEvent, startTime: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-700" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">End</label>
                      <input type="time" required value={newEvent.endTime} onChange={e => setNewEvent({...newEvent, endTime: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-700" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                  <textarea required rows="3" value={newEvent.desc} onChange={e => setNewEvent({...newEvent, desc: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium resize-none" placeholder="Briefly describe the event requirements..."></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all">Submit Request</motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClubDashboard;