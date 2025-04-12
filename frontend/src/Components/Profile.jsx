import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch('http://localhost:5000/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load profile:', err);
        setLoading(false);
      });
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    hover: { scale: 1.02, transition: { duration: 0.3 } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg text-gray-600 font-semibold animate-pulse"
        >
          Loading profile...
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-red-300">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg text-red-600 font-semibold animate-pulse"
        >
          User not found or unauthorized
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      <motion.div
        key={user._id || user.Email}
        className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 border border-indigo-200"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
      >
        {/* Profile Image */}
        <div className="flex justify-center mb-8">
          <motion.img
            src={user.Image || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="w-36 h-36 rounded-full object-cover border-4 border-indigo-400 shadow-lg hover:shadow-xl transition-shadow duration-300"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Heading */}
        <motion.h2
          className="text-4xl font-extrabold text-center text-gray-800 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 drop-shadow-md"
          variants={textVariants}
        >
          {user.Name}'s Profile
        </motion.h2>

        {/* User Details */}
        <div className="space-y-5 text-gray-700 bg-gray-50 rounded-lg p-4">
          <motion.div variants={textVariants} className="flex items-center space-x-3">
            <span className="font-semibold text-indigo-600 w-24">Name:</span>
            <span className="flex-1">{user.Name || 'N/A'}</span>
          </motion.div>
          <motion.div variants={textVariants} className="flex items-center space-x-3">
            <span className="font-semibold text-indigo-600 w-24">Email:</span>
            <span className="flex-1">{user.Email || 'N/A'}</span>
          </motion.div>
          {user.Number && (
            <motion.div variants={textVariants} className="flex items-center space-x-3">
              <span className="font-semibold text-indigo-600 w-24">Phone:</span>
              <span className="flex-1">{user.Number}</span>
            </motion.div>
          )}
          <motion.div variants={textVariants} className="flex items-center space-x-3">
            <span className="font-semibold text-indigo-600 w-24">Role:</span>
            <span className="flex-1 capitalize bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm">
              {user.role || 'Unknown'}
            </span>
          </motion.div>
          {user.role === 'Employee' && user.Department && (
            <motion.div variants={textVariants} className="flex items-center space-x-3">
              <span className="font-semibold text-indigo-600 w-24">Department:</span>
              <span className="flex-1">{user.Department}</span>
            </motion.div>
          )}
          {user.role === 'Guard' && user.Shift && (
            <motion.div variants={textVariants} className="flex items-center space-x-3">
              <span className="font-semibold text-indigo-600 w-24">Shift:</span>
              <span className="flex-1">{user.Shift}</span>
            </motion.div>
          )}
        </div>

        {/* Logout Button */}
        <motion.button
          onClick={handleLogout}
          className="mt-6 w-full bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Logout
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Profile;
