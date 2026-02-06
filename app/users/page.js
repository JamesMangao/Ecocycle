'use client'

import { useState, useEffect } from 'react';
import withAuth from '../components/withAuth';
import { BackButton } from '../components/BackButton';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await fetch(`${backendURL}/api/admin/users`);
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
        const response = await fetch(`${backendURL}/api/admin/users/${userId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setUsers(users.filter((user) => user.id !== userId));
          alert('User deleted successfully.');
        } else {
          const errorData = await response.json();
          alert(`Failed to delete user: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('An error occurred while deleting the user.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl font-semibold">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="grid grid-cols-3 items-center mb-8">
        <div>{/* Left empty space */}</div>
        <h1 className="text-4xl font-bold text-green-600 text-center col-span-1">
          User Management
        </h1>
        <div className="flex justify-end">
          <BackButton href="/dashboard" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
            {users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No users yet. Register users in the Android app!
                </div>
            ) : (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.points}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                    {user.role}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(UsersPage);
