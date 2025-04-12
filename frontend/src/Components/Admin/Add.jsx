import React, { useRef, useState } from 'react';

const Add = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const phoneRef = useRef();
  const departmentRef = useRef();
  const imageRef = useRef();
  const roleRef = useRef();

  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    const formData = new FormData();
    formData.append('name', nameRef.current.value);
    formData.append('email', emailRef.current.value);
    formData.append('password', passwordRef.current.value);
    formData.append('phoneNumber', phoneRef.current.value);
    formData.append('role', roleRef.current.value);

    if (imageRef.current?.files[0]) {
      formData.append('Image', imageRef.current.files[0]);
    }

    if (roleRef.current.value === 'Employee') {
      formData.append('department', departmentRef.current.value);
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://vms-moveinsync.onrender.com/admin/add', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'User added successfully!');
        e.target.reset();
        setRole('');
      } else {
        setMessage(data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error while sending request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-105">
        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 drop-shadow-md">
          Add New User (Employee / Guard)
        </h2>

        {/* Message */}
        {message && (
          <p
            className={`text-center font-semibold py-2 rounded-md mb-6 ${
              message.includes('successfully')
                ? 'text-green-700 bg-green-100'
                : 'text-red-700 bg-red-100'
            } animate-pulse`}
          >
            {message}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <input
              type="text"
              ref={nameRef}
              placeholder="Full Name"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 bg-gray-50"
            />
          </div>

          {/* Email Input */}
          <div>
            <input
              type="email"
              ref={emailRef}
              placeholder="Email Address"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 bg-gray-50"
            />
          </div>

          {/* Password Input */}
          <div>
            <input
              type="password"
              ref={passwordRef}
              placeholder="Password"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 bg-gray-50"
            />
          </div>

          {/* Phone Number Input */}
          <div>
            <input
              type="tel"
              ref={phoneRef}
              placeholder="Phone Number"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 bg-gray-50"
            />
          </div>

          {/* Image Upload */}
          <div>
            <input
              type="file"
              ref={imageRef}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all duration-200"
            />
          </div>

          {/* Role Select */}
          <div>
            <select
              ref={roleRef}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-700 bg-gray-50"
              defaultValue=""
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="Employee">Employee</option>
              <option value="Guard">Guard</option>
            </select>
          </div>

          {/* Department Input (Conditional) */}
          {role === 'Employee' && (
            <div>
              <input
                type="text"
                ref={departmentRef}
                placeholder="Department (Employee Only)"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 bg-gray-50"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-lg font-semibold transition-all duration-300 shadow-md ${
              loading
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg hover:scale-105'
            }`}
          >
            {loading ? 'Adding...' : 'Add User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add;