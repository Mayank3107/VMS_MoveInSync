import React, { useRef, useState } from 'react';

const SignUp = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const numberRef = useRef();
  const departmentRef = useRef();
  const companyRef = useRef(); // ✅ For Visitor
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

    if (role === 'Visitor') {
      formData.append('Company', companyRef.current.value); // ✅ Send company
    }

    if (imageRef.current.files[0]) {
      formData.append('Image', imageRef.current.files[0]);
    }

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
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Sign Up
        </h2>

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

        <input
          type="text"
          ref={nameRef}
          placeholder="Enter your name"
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
        />

        <input
          type="email"
          ref={emailRef}
          placeholder="Enter your email"
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
        />

        <input
          type="password"
          ref={passwordRef}
          placeholder="Enter your password"
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
        />

        <input
          type="tel"
          ref={numberRef}
          placeholder="Enter your phone number"
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
        />

        <input
          type="file"
          ref={imageRef}
          accept="image/*"
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-700"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
        >
          <option value="" disabled>
            Select your role
          </option>
          <option value="Visitor">Visitor</option>
        </select>

        {/* Conditional Input for Employee Department */}
        {role === 'Employee' && (
          <input
            type="text"
            ref={departmentRef}
            placeholder="Enter your department"
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        )}

        {/* ✅ Conditional Input for Visitor Company */}
        {role === 'Visitor' && (
          <input
            type="text"
            ref={companyRef}
            placeholder="Enter your company name"
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-lg font-semibold"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SignUp;
