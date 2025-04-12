import React from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from '../Profile';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Section */}
        <div className="mb-12">
          <Profile />
        </div>

        {/* Admin Dashboard Section */}
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 drop-shadow-md">
            Admin Dashboard
          </h2>

          <div className="flex flex-col gap-6 max-w-sm mx-auto">
            {/* Add User Button */}
            <button
              onClick={() => navigate('/Admin/Add')}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Add User
            </button>

            {/* Edit Users Button */}
            <button
              onClick={() => navigate('/Admin/Edit')}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Edit Users
            </button>

            {/* View Visitors Button */}
            <button
              onClick={() => navigate('/Admin/Visitors')}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-md hover:from-purple-600 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              View Visitors
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;