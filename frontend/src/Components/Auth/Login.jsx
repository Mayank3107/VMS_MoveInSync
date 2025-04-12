import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const roleRef = useRef();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formData = {
      email: emailRef.current.value.trim(),
      password: passwordRef.current.value,
      role: roleRef.current.value,
    };

    try {
      const res = await fetch('https://vms-moveinsync.onrender.com/auth/Login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('email', formData.email);

      switch (formData.role) {
        case 'Admin':
          navigate('/Admin/Home');
          break;
        case 'Visitor':
          navigate('/Visitor/Home');
          break;
        case 'Guard':
          navigate('/Guard/Home');
          break;
        case 'Employee':
          navigate('/Employee/Request');
          break;
        default:
          setError('Invalid role');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-105">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Login
        </h2>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm mb-6 text-center font-semibold bg-red-100 rounded-md py-2 animate-pulse">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <input
              type="email"
              ref={emailRef}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <input
              type="password"
              ref={passwordRef}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Role Select */}
          <div>
            <select
              ref={roleRef}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-700 bg-gray-50"
              required
            >
              <option value="" disabled selected>
                Select your role
              </option>
              <option value="Visitor">Visitor</option>
              <option value="Employee">Employee</option>
              <option value="Guard">Guard</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;