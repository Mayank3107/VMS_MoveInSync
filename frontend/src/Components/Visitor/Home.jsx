import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import Profile from '../Profile';

Modal.setAppElement('#root'); // Set root element for accessibility

const Home = () => {
  const [visits, setVisits] = useState([]);
  const [mapOpen, setMapOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:5000/visitor/requests', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(async (data) => {
        const updatedVisits = await Promise.all(
          data.visits.map(async (visit) => {
            if (visit.status === 'Approved') {
              const qrData = JSON.stringify({
                visitorId: visit.visitorId,
                visitorName: visit.visitorName,
                employeeEmail: visit.employeeEmail,
                visitTime: visit.visitTime,
                duration: visit.duration,
                status: visit.status,
              });
              const qrImage = await QRCode.toDataURL(qrData);
              return { ...visit, qrImage };
            }
            return visit;
          })
        );

        setVisits(updatedVisits);
      })
      .catch(err => console.error('Error fetching visits:', err));
  }, []);

  const handleRequestRedirect = () => {
    navigate('/visitor/request');
  };

  const handleQrClick = (visit) => {
    setSelectedVisit(visit);
    setMapOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <Profile />
        </div>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            My Visit Requests
          </h2>
          <button
            onClick={handleRequestRedirect}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
          >
            + New Visit Request
          </button>
        </div>

        {visits.length === 0 ? (
          <p className="text-gray-600 text-center text-lg font-medium bg-gray-100 py-4 rounded-lg shadow-inner">
            No visit requests found.
          </p>
        ) : (
          <ul className="space-y-6">
            {visits.map((visit) => (
              <li
                key={visit._id}
                className="bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-102 transform"
              >
                <div className="space-y-3">
                  <p><span className="font-semibold text-indigo-600 w-28 inline-block">To:</span>{visit.employeeEmail}</p>
                  <p><span className="font-semibold text-indigo-600 w-28 inline-block">Visit Time:</span>{new Date(visit.visitTime).toLocaleString()}</p>
                  <p><span className="font-semibold text-indigo-600 w-28 inline-block">Duration:</span>{visit.duration} mins</p>
                  <p>
                    <span className="font-semibold text-indigo-600 w-28 inline-block">Status:</span>
                    <span className={`font-semibold px-2 py-1 rounded-full text-sm ${
                      visit.status === 'Approved'
                        ? 'text-green-700 bg-green-100'
                        : 'text-yellow-700 bg-yellow-100'
                    }`}>
                      {visit.status}
                    </span>
                  </p>
                </div>

                {visit.status === 'Approved' && visit.qrImage && (
                  <div className="mt-6 flex flex-col items-center">
                    <img
                      src={visit.qrImage}
                      alt="QR Code"
                      className="w-36 h-36 border-2 border-indigo-300 rounded-lg shadow-md hover:scale-110 transition-transform duration-300 cursor-pointer"
                      onClick={() => handleQrClick(visit)}
                    />
                    <p className="text-sm text-gray-500 mt-3 italic">Click QR to view office map</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Office Map Modal */}
        <Modal
          isOpen={mapOpen}
          onRequestClose={() => setMapOpen(false)}
          contentLabel="Office Map"
          className="max-w-3xl mx-auto mt-20 bg-white rounded-lg shadow-xl outline-none p-6"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
        >
          <h2 className="text-lg font-bold mb-4 text-center text-indigo-700">Office Navigation Map</h2>
          <img
  src="/map.png"
  alt="Office Map"
  className="max-w-2xl w-full h-[400px] object-contain border rounded shadow mx-auto"
/>

          <div className="mt-4 text-center">
            <button
              onClick={() => setMapOpen(false)}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Home;
