import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from '../Profile';

const Request = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://vms-moveinsync.onrender.com/employee/visit-requests', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRequests(data.requests || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching visit requests:', err);
        setLoading(false);
      });
  }, []);

  const handleAction = (id, action) => {
    fetch(`https://vms-moveinsync.onrender.com/employee/visit-requests/${id}/${action}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        setRequests((prev) =>
          prev.map((req) =>
            req._id === id
              ? { ...req, status: action === 'accept' ? 'Approved' : 'Rejected' }
              : req
          )
        );
      })
      .catch((err) => console.error(`Failed to ${action} request`, err));
  };

  const handleNewRequest = () => {
    navigate('/employee/create');
  };

  const formatIST = (time, duration) => {
    const start = new Date(time);
    const end = new Date(start.getTime() + duration * 60000);
    return {
      start: start.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      end: end.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Section */}
        <div className="mb-12">
          <Profile />
        </div>

        {/* Requests Section */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Visitor Requests
          </h2>
          <button
            onClick={handleNewRequest}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            + New Visit Request
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600 text-center text-lg font-medium bg-gray-100 py-4 rounded-lg shadow-inner animate-pulse">
            Loading requests...
          </p>
        ) : requests.length === 0 ? (
          <p className="text-gray-500 text-center text-lg font-medium bg-gray-100 py-4 rounded-lg shadow-inner">
            No pending requests
          </p>
        ) : (
          <ul className="space-y-6">
            {requests.map((req) => {
              const { start, end } = formatIST(req.visitTime, req.duration);
              return (
                <li
                  key={req._id}
                  className="bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-102 transform"
                >
                  <p className="text-lg font-semibold text-gray-800 mb-2">
                    Visitor: {req.visitorName}
                  </p>
                  <div className="space-y-3 text-gray-700">
                    <p className="flex items-center space-x-2">
                      <span className="font-semibold text-indigo-600 w-28">Email:</span>
                      <span>{req.visitorEmail || 'N/A'}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <span className="font-semibold text-indigo-600 w-28">Company:</span>
                      <span>{req.Company || 'N/A'}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <span className="font-semibold text-indigo-600 w-28">Status:</span>
                      <span
                        className={`font-semibold px-2 py-1 rounded-full text-sm ${
                          req.status === 'Approved'
                            ? 'text-green-700 bg-green-100'
                            : req.status === 'Rejected'
                            ? 'text-red-700 bg-red-100'
                            : 'text-yellow-700 bg-yellow-100'
                        }`}
                      >
                        {req.status}
                      </span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <span className="font-semibold text-indigo-600 w-28">Time (IST):</span>
                      <span>{start} → {end}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <span className="font-semibold text-indigo-600 w-28">Reason:</span>
                      <span>{req.reason}</span>
                    </p>
                  </div>

                  {req.status === 'Pending' && (
                    <div className="mt-4 flex gap-4 justify-end">
                      <button
                        onClick={() => handleAction(req._id, 'accept')}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:shadow-lg hover:scale-105"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleAction(req._id, 'reject')}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:shadow-lg hover:scale-105"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Request;