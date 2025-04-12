import React, { useState } from 'react';

const Create = () => {
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const [duration, setDuration] = useState('');
  const [message, setMessage] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const employeeEmail = localStorage.getItem('email');

    const visitDateIST = new Date(
      new Date(visitTime).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
    );
    const hourIST = visitDateIST.getHours();

    if (hourIST < 10 || hourIST >= 12) {
      setMessage('Visit time must be between 10 AM and 12 PM IST');
      return;
    }

    try {
      const res = await fetch('https://vms-moveinsync.onrender.com/employee/create-visit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          visitorEmail,
          employeeEmail,
          visitTime,
          duration,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Visit created successfully (auto-approved)');
        setVisitorEmail('');
        setVisitTime('');
        setDuration('');
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage('Error creating visit');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-2xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 drop-shadow-md">
          Create Visit (Auto-Approved)
        </h2>

        <form onSubmit={handleCreate} className="space-y-6">
          <input
            type="email"
            value={visitorEmail}
            onChange={(e) => setVisitorEmail(e.target.value)}
            placeholder="Visitor's Email"
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          <input
            type="datetime-local"
            value={visitTime}
            onChange={(e) => setVisitTime(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Duration (minutes)"
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white p-3 rounded-lg font-semibold hover:bg-indigo-600"
          >
            Create Visit
          </button>

          {message && (
            <p
              className={`mt-4 text-center font-semibold py-2 rounded-md ${
                message.includes('successfully')
                  ? 'text-green-700 bg-green-100'
                  : 'text-red-700 bg-red-100'
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Create;
