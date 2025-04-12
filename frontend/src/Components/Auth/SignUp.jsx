import React, { useRef, useState } from 'react';

const SignUp = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const numberRef = useRef();
  const departmentRef = useRef();
  const imageRef = useRef();
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const formData = new FormData();
    formData.append('Name', nameRef.current.value);
    formData.append('Email', emailRef.current.value);
    formData.append('PassWord', passwordRef.current.value);
    formData.append('Number', numberRef.current.value);
    formData.append('role', role);

    if (role === 'Employee') {
      formData.append('DepartMent', departmentRef.current.value);
    }

    if (imageRef.current.files[0]) {
      formData.append('Image', imageRef.current.files[0]);
    }
// console.log(formData)
    try {
      const res = await fetch('http://localhost:5000/auth/SignUp', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Signup successful!');
        e.target.reset();
        setRole('');
      } else {
        setMessage(data.message || 'Signup failed.');
      }
    } catch (err) {
      console.error(err);
      setMessage('An error occurred during signup.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md space-y-6 transform transition-all duration-300 hover:scale-105"
        encType="multipart/form-data"
      >
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Sign Up
        </h2>

        {/* Message */}
        {message && (
          <div
            className={`text-center text-sm font-medium py-2 rounded-md ${
              message.includes('successful')
                ? 'text-green-700 bg-green-100'
                : 'text-red-700 bg-red-100'
            } animate-pulse`}
          >
            {message}
          </div>
        )}

        {/* Name Input */}
        <div>
          <input
            type="text"
            ref={nameRef}
            placeholder="Enter your name"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
          />
        </div>

        {/* Email Input */}
        <div>
          <input
            type="email"
            ref={emailRef}
            placeholder="Enter your email"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
          />
        </div>

        {/* Password Input */}
        <div>
          <input
            type="password"
            ref={passwordRef}
            placeholder="Enter your password"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
          />
        </div>

        {/* Phone Number Input */}
        <div>
          <input
            type="tel"
            ref={numberRef}
            placeholder="Enter your phone number"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
          />
        </div>

        {/* Image Upload */}
        <div>
          <input
            type="file"
            ref={imageRef}
            accept="image/*"
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all duration-200"
          />
        </div>

        {/* Role Select */}
        <div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-700 bg-gray-50"
          >
            <option value="" disabled>
              Select your role
            </option>
            {/* <option value="Employee">Employee</option> */}
            <option value="Visitor">Visitor</option>
            {/* <option value="Guard">Guard</option> */}
          </select>
        </div>

        {/* Department Input (Conditional) */}
        {role === 'Employee' && (
          <div>
            <input
              type="text"
              ref={departmentRef}
              placeholder="Enter your department"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SignUp;