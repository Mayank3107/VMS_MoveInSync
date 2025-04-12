import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Main = () => {
  const navigate = useNavigate();

  const handleClick = (type) => {
    if (type === 'Login') navigate('/Login');
    else navigate('/SignUp');
  };

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.2 },
    },
  };

  // Animation variants for child elements
  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Button hover animation
  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.15)' },
    tap: { scale: 0.95 },
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 px-4">
    {/* Heading and Purpose Text */}
<motion.h2
  className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 drop-shadow-md"
  variants={childVariants}
>
  Welcome to the Visitor Management System
</motion.h2>

<motion.p
  className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto mb-10 leading-relaxed"
  variants={childVariants}
>
  Our system simplifies and secures the process of managing visitors in your organization. 
  From streamlined check-ins and real-time approvals to QR-based verification and live tracking, 
  we make visitor access smooth, efficient, and smart.
</motion.p>

      {/* Animated Container */}
      <motion.div
        className="text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Heading */}
        <motion.h2
          className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-10 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 drop-shadow-md"
          variants={childVariants}
        >
          Welcome to the Visitor Management System
        </motion.h2>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8">
          <motion.button
            onClick={() => handleClick('Login')}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 ease-in-out"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Login
          </motion.button>
          <motion.button
            onClick={() => handleClick('SignUp')}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 ease-in-out"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Sign Up
          </motion.button>
        </div>
      </motion.div>

      {/* Optional Decorative Element */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-indigo-300 to-transparent opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1, duration: 1 }}
      />
    </div>
  );
};

export default Main;