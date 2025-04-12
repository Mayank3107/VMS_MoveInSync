import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Edit = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:5000/admin/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized or server error');
        return res.json();
      })
      .then((data) => {
        const uniqueUsers = data.users.filter(
          (user, index, self) =>
            index === self.findIndex((u) => u._id === user._id && u.role === user.role)
        );
        setUsers(uniqueUsers);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setUsers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user?.Name?.toLowerCase().includes(search.toLowerCase()) ||
      user?.Email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditClick = (user) => {
    navigate(`/admin/edit/${user._id}`, { state: { user } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 drop-shadow-md">
          Manage Users
        </h2>
        <p className="mb-6 text-gray-600 text-lg">
          Total Users: <span className="font-semibold text-indigo-600">{filteredUsers.length}</span>
        </p>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 bg-gray-50 shadow-sm"
        />

        {/* Loading/Empty States */}
        {loading ? (
          <p className="text-gray-600 text-center text-lg font-medium bg-gray-100 py-4 rounded-lg shadow-inner mt-6 animate-pulse">
            Loading users...
          </p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-red-600 text-center text-lg font-medium bg-red-100 py-4 rounded-lg shadow-inner mt-6">
            No users found
          </p>
        ) : (
          /* Users List */
          <ul className="space-y-4 mt-6">
            {filteredUsers.map((user, index) => (
              <li
                key={`${user._id}-${user.role}-${index}`}
                className="bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-102 transform cursor-pointer"
                onClick={() => handleEditClick(user)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold text-gray-800">{user?.Name}</div>
                    <div className="text-sm text-gray-600 mt-1">{user?.Email}</div>
                  </div>
                  <div
                    className={`text-sm font-semibold px-3 py-1 rounded-full capitalize ${
                      user?.role === 'Employee'
                        ? 'text-indigo-700 bg-indigo-100'
                        : user?.role === 'Guard'
                        ? 'text-green-700 bg-green-100'
                        : 'text-gray-700 bg-gray-100'
                    }`}
                  >
                    {user?.role}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Edit;