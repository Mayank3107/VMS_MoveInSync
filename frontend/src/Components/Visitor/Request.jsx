import React, { useRef } from 'react';

const Request = () => {
  const employeeEmailRef = useRef();
  const reasonRef = useRef();
  const durationRef = useRef();
  const visitTimeRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const visitTimeInput = visitTimeRef.current.value;
    const visitDateIST = new Date(
      new Date(visitTimeInput).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
    );
    const hourIST = visitDateIST.getHours();

    if (hourIST < 10 || hourIST >= 12) {
      alert('Visit time must be between 10 AM and 12 PM IST');
      return;
    }

    const payload = {
      employeeEmail: employeeEmailRef.current.value,
      reason: reasonRef.current.value,
      duration: Number(durationRef.current.value),
      visitTime: new Date(visitTimeInput),
    };

    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:5000/visitor/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Visit request sent successfully');
      } else {
        alert(`Failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-2xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 drop-shadow-md">
          Visitor Visit Request
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Employee Email Input */}
          <input
            type="email"
            ref={employeeEmailRef}
            placeholder="Employee Email"
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          {/* Reason Input */}
          <input
            type="text"
            ref={reasonRef}
            placeholder="Reason for Visit"
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          {/* Duration Input */}
          <input
            type="number"
            ref={durationRef}
            placeholder="Duration (minutes)"
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          {/* Visit Time Input */}
          <input
            type="datetime-local"
            ref={visitTimeRef}
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white p-3 rounded-lg font-semibold hover:bg-indigo-600"
          >
            Send Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default Request;
