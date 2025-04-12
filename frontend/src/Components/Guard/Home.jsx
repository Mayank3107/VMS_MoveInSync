import React, { useState } from 'react';
import Profile from '../Profile';

const GuardVerify = () => {
  const [qrData, setQrData] = useState('');
  const [visitDetails, setVisitDetails] = useState(null);
  const [status, setStatus] = useState('');

  const token = localStorage.getItem('token');

  const handleVerify = async () => {
    try {
      const res = await fetch('https://vms-moveinsync.onrender.com/guard/verify-visit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ qrData }),
      });

      const data = await res.json();
      // console.log(data);
      setVisitDetails(data.visit);
      if (!res.ok) {
        setStatus(data.message || 'Invalid Visit');
      } else {
        setStatus('VALID VISIT');
      }
    } catch (error) {
      setStatus('Error verifying visit');
    }
  };

  const markEntry = async () => {
    try {
      const res = await fetch(`https://vms-moveinsync.onrender.com/guard/visit-entry/${visitDetails._id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setVisitDetails(data.visit);
        setStatus('Entry marked successfully');
      } else {
        setStatus(data.message || 'Error marking entry');
      }
    } catch (err) {
      setStatus('Error marking entry');
    }
  };

  const markExit = async () => {
    try {
      const res = await fetch(`https://vms-moveinsync.onrender.com/guard/visit-exit/${visitDetails._id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setVisitDetails(data.visit);
        setStatus('Exit marked successfully');
      } else {
        setStatus(data.message || 'Error marking exit');
      }
    } catch (err) {
      setStatus('Error marking exit');
    }
  };

  const isWithinVisitTime = () => {
    if (!visitDetails?.visitTime || !visitDetails?.duration) return false;

    const now = new Date();
    const start = new Date(visitDetails.visitTime);
    const end = new Date(start.getTime() + visitDetails.duration * 60000);

    return now >= start && now <= end;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <Profile />
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-105">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 drop-shadow-md">
            Guard Visit Verification
          </h2>

          <textarea
            rows="3"
            value={qrData}
            onChange={(e) => setQrData(e.target.value)}
            placeholder="Paste scanned QR data here"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none bg-gray-50"
          />

          <button
            onClick={handleVerify}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg hover:scale-105 mt-4"
          >
            Verify Visit
          </button>

          {status && (
            <p
              className={`mt-6 text-center font-semibold py-2 rounded-md ${
                status.includes('VALID') || status.includes('successfully')
                  ? 'text-green-700 bg-green-100'
                  : 'text-red-700 bg-red-100'
              } animate-pulse`}
            >
              {status}
            </p>
          )}

          {visitDetails && (
            <div className="mt-8 bg-gray-50 border border-gray-200 p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-6">
                <img
                  src={visitDetails.Image || 'https://via.placeholder.com/150'}
                  alt="Visitor"
                  className="w-32 h-32 rounded-full border-4 border-indigo-300 object-cover shadow-lg hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="space-y-4 text-gray-700">
                <p><span className="font-semibold text-indigo-600 w-32 inline-block">Visitor Name:</span>{visitDetails.visitorName}</p>
                <p><span className="font-semibold text-indigo-600 w-32 inline-block">Visitor Email:</span>{visitDetails.visitorEmail}</p>
                <p><span className="font-semibold text-indigo-600 w-32 inline-block">Employee:</span>{visitDetails.employeeEmail}</p>
                <p><span className="font-semibold text-indigo-600 w-32 inline-block">Status:</span>
                  <span className={`font-semibold px-2 py-1 rounded-full text-sm ${
                    visitDetails.status === 'Approved' ? 'text-green-700 bg-green-100' : 'text-yellow-700 bg-yellow-100'
                  }`}>{visitDetails.status}</span>
                </p>
                <p><span className="font-semibold text-indigo-600 w-32 inline-block">Reason:</span>{visitDetails.reason}</p>
                <p><span className="font-semibold text-indigo-600 w-32 inline-block">Entry Time:</span>
                  {visitDetails.entryTime ? new Date(visitDetails.entryTime).toLocaleString() : 'Not marked'}
                </p>
                <p><span className="font-semibold text-indigo-600 w-32 inline-block">Exit Time:</span>
                  {visitDetails.exitTime ? new Date(visitDetails.exitTime).toLocaleString() : 'Not marked'}
                </p>
                <p><span className="font-semibold text-indigo-600 w-32 inline-block">Time Validity:</span>
                  {(() => {
                    const start = new Date(visitDetails.visitTime);
                    const end = new Date(start.getTime() + visitDetails.duration * 60000);
                    return `${start.toLocaleString()} → ${end.toLocaleString()}`;
                  })()}
                </p>
              </div>

              <div className="mt-6 flex gap-4 justify-center">
                {visitDetails.status === 'Approved' && isWithinVisitTime() && !visitDetails.hasEntered && (
                  <button
                    onClick={markEntry}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    Mark Entry
                  </button>
                )}
                {visitDetails.status === 'Approved' && isWithinVisitTime() && visitDetails.hasEntered && !visitDetails.hasExited && (
                  <button
                    onClick={markExit}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    Mark Exit
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuardVerify;
