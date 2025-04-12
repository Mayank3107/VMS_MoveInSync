import React, { useEffect, useState } from 'react';

const Visitors = () => {
  const [visits, setVisits] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:5000/admin/visits', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        // console.log(data.visits);
        setVisits(data.visits || []);
      })
      .catch(err => {
        console.error('Error fetching visits:', err);
        setVisits([]);
      });
  }, []);

  const filteredVisits = visits
    .filter(visit => visit && visit.visitorEmail && visit.employeeEmail)
    .filter(visit =>
      visit.visitorEmail.toLowerCase().includes(search.toLowerCase()) ||
      visit.employeeEmail.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-semibold mb-6 text-center">Visit History</h2>

      <input
        type="text"
        placeholder="Search by Visitor or Employee Email"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-6 p-2 w-full max-w-md mx-auto block border border-gray-300 rounded shadow-sm"
      />

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full table-auto text-sm text-gray-700">
          <thead className="bg-blue-100 text-blue-800">
            <tr>
              <th className="px-4 py-2 border">Visitor Email</th>
              <th className="px-4 py-2 border">Employee Email</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">From</th>
              <th className="px-4 py-2 border">To</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisits.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No matching visits found.
                </td>
              </tr>
            ) : (
              filteredVisits.map((visit) => {
                const fromTime = new Date(visit.visitTime);
                const toTime = new Date(fromTime.getTime() + visit.duration * 60000); // adding minutes

                return (
                  <tr key={visit._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{visit.visitorEmail}</td>
                    <td className="border px-4 py-2">{visit.employeeEmail}</td>
                    <td className="border px-4 py-2">
                      {fromTime.toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">
                      {fromTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="border px-4 py-2">
                      {toTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="border px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-white ${
                          visit.status === 'Approved'
                            ? 'bg-green-500'
                            : visit.status === 'Rejected'
                            ? 'bg-red-500'
                            : 'bg-yellow-500'
                        }`}
                      >
                        {visit.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Visitors;
