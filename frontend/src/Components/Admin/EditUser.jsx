import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EditUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state || {};

  const [formData, setFormData] = useState({
    name: user?.Name || '',
    email: user?.Email || '',
    phoneNumber: user?.PhoneNumber || '',
    department: user?.Department || '',
    role: user?.role || '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`https://vms-moveinsync.onrender.com/admin/edit/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message || 'Update failed');

      alert('User updated successfully');
      navigate('/admin/edit');
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <p className="text-center text-red-600 text-lg font-semibold bg-red-100 py-3 px-6 rounded-lg shadow-md animate-pulse">
          No user data found.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-105">
        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 drop-shadow-md">
          Edit {formData.role} Profile
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 bg-gray-50"
            />
          </div>

          {/* Email Input */}
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 bg-gray-50"
            />
          </div>

          {/* Phone Number Input */}
          <div>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 bg-gray-50"
            />
          </div>

          {/* Department Input (Conditional) */}
          {formData.role === 'Employee' && (
            <div>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Department"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 bg-gray-50"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;