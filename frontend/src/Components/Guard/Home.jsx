import React, { useState, useRef, useEffect } from 'react';
import Profile from '../Profile';

const GuardVerify = () => {
  const [qrData, setQrData] = useState('');
  const [visitDetails, setVisitDetails] = useState(null);
  const [status, setStatus] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Start video stream when component loads
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        })
        .catch(err => {
          console.error("Error accessing camera:", err);
        });
    }
  }, []);

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
      setVisitDetails(data.visit);
      setStatus(res.ok ? 'VALID VISIT' : data.message || 'Invalid Visit');
    } catch (error) {
      setStatus('Error verifying visit');
    }
  };

  const capturePhoto = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 320, 240);
    return canvasRef.current.toDataURL('image/jpeg');
  };

  const markEntry = async () => {
    const imageBase64 = capturePhoto();
    try {
      const res = await fetch(`https://vms-moveinsync.onrender.com/guard/visit-entry/${visitDetails._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ photo: imageBase64 }),
      });
      const data = await res.json();
      setVisitDetails(data.visit);
      setStatus(res.ok ? 'Entry marked successfully' : data.message || 'Error marking entry');
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
      setVisitDetails(data.visit);
      setStatus(res.ok ? 'Exit marked successfully' : data.message || 'Error marking exit');
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
        <div className="mb-12"><Profile /></div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
            Guard Visit Verification
          </h2>

          <textarea
            rows="3"
            value={qrData}
            onChange={(e) => setQrData(e.target.value)}
            placeholder="Paste scanned QR data here"
            className="w-full p-4 border rounded-lg bg-gray-50"
          />
          <button onClick={handleVerify} className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg">
            Verify Visit
          </button>

          {status && (
            <p className={`mt-6 text-center font-semibold py-2 rounded-md ${status.includes('VALID') ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
              {status}
            </p>
          )}

          {/* Camera Preview and Canvas */}
          <div className="flex justify-center mt-6 gap-6">
            <video ref={videoRef} width="320" height="240" className="rounded-lg border shadow" />
            <canvas ref={canvasRef} width="320" height="240" className="hidden" />
          </div>

          {visitDetails && (
            <div className="mt-6 space-y-4 text-gray-700">
              {/* Visit Details */}
              <p><strong>Visitor:</strong> {visitDetails.visitorName}</p>
              <p><strong>Email:</strong> {visitDetails.visitorEmail}</p>
              <p><strong>Status:</strong> {visitDetails.status}</p>
              <p><strong>Company:</strong> {visitDetails.Company || 'N/A'}</p>

              <div className="mt-4 flex flex-col items-center gap-4">
  {visitDetails.status === 'Pending' && (
    <p className="text-sm text-yellow-700">Visit is not approved yet.</p>
  )}
  {visitDetails.status === 'Expired' && (
    <p className="text-sm text-yellow-700">Visit is already Expired.</p>
  )}
  {!isWithinVisitTime() &&visitDetails.status==='Approved' && (
    <p className="text-sm text-red-700">Visit is not within allowed time.</p>
  )}
  {visitDetails.hasEntered && (
    <p className="text-sm text-blue-700">Visitor has already entered.</p>
  )}
  {visitDetails.status === 'Approved' && isWithinVisitTime() && !visitDetails.hasEntered && (
    <button
      onClick={markEntry}
      className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
    >
      Mark Entry
    </button>
  )}
  {visitDetails.status === 'Approved' && isWithinVisitTime() && visitDetails.hasEntered && !visitDetails.hasExited && (
    <button
      onClick={markExit}
      className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
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
