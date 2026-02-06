'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import withAuth from '../components/withAuth';
import BackButton from '../components/BackButton';

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/rewards`;

function RewardManagement() {
  const [rewards, setRewards] = useState([]);
  const [editingReward, setEditingReward] = useState(null);
  const [loading, setLoading] = useState(false);
   const [feedback, setFeedback] = useState(null);

  const fetchRewards = async () => {
    try {
      const response = await axios.get(API_URL);
      setRewards(response.data);
    } catch (error) {
      console.error("Failed to fetch rewards:", error);
      const message = error.response?.data?.message || error.message || 'Failed to fetch rewards.';
      setFeedback({ type: 'error', message });
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const rewardData = {
        name: formData.get('name').trim(),
        requiredPoints: Number(formData.get('requiredPoints')),
        stock: Number(formData.get('stock')),
        description: formData.get('description').trim(),
      };

      if (editingReward) {
        await axios.put(`${API_URL}/${editingReward.id}`, rewardData);
        setFeedback({ type: 'success', message: 'Reward updated successfully!' });
      } else {
        await axios.post(API_URL, rewardData);
        setFeedback({ type: 'success', message: 'Reward added successfully!' });
      }

      e.target.reset();
      setEditingReward(null);
      fetchRewards();
    } catch (error) {
      console.error('Error:', error);
      setFeedback({ type: 'error', message: `Operation failed: ${error.response?.data?.message || error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (rewardId, rewardName) => {
    if (window.confirm(`Are you sure you want to delete ${rewardName}?`)) {
      try {
        await axios.delete(`${API_URL}/${rewardId}`);
        setFeedback({ type: 'success', message: 'Reward deleted successfully!' });
        fetchRewards();
      } catch (error) {
        setFeedback({ type: 'error', message: `Failed to delete: ${error.response?.data?.message || error.message}` });
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <div style={{ width: 88 }} />
            <h1 className="text-2xl font-bold">Manage Rewards</h1>
            <BackButton href="/dashboard" />
        </div>
      {feedback && (
        <div className={`mb-4 p-3 rounded ${feedback.type === 'success' 
          ? 'bg-green-100 text-green-700' 
          : 'bg-red-100 text-red-700'}`}>
          {feedback.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg shadow-sm">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            name="name"
            placeholder="Reward Name"
            className="p-2 border rounded"
            defaultValue={editingReward?.name}
            required
            disabled={loading}
          />
          <input
            name="requiredPoints"
            type="number"
            min="1"
            placeholder="Required Points"
            className="p-2 border rounded"
            defaultValue={editingReward?.requiredPoints}
            required
            disabled={loading}
          />
          <input
            name="stock"
            type="number"
            min="0"
            placeholder="Stock Quantity"
            className="p-2 border rounded"
            defaultValue={editingReward?.stock}
            required
            disabled={loading}
          />
          <textarea
            name="description"
            placeholder="Description"
            className="p-2 border rounded col-span-2"
            defaultValue={editingReward?.description}
            disabled={loading}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className={`px-4 py-2 rounded ${loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            disabled={loading}
          >
            {loading ? 'Saving...' : (editingReward ? 'Update Reward' : 'Add Reward')}
          </button>
          {editingReward && (
            <button
              type="button"
              onClick={() => {
                setEditingReward(null);
                document.querySelector('form').reset();
              }}
              className="bg-gray-200 px-4 py-2 rounded"
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto rounded-lg border shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Required Points</th>
              <th className="text-left p-3">Stock</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rewards.map(reward => (
              <tr key={reward.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{reward.name}</td>
                <td className="p-3">{reward.requiredPoints}</td>
                <td className="p-3">{reward.stock}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => setEditingReward(reward)}
                    className="text-blue-500 hover:text-blue-700"
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(reward.id, reward.name)}
                    className="text-red-500 hover:text-red-700"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default withAuth(RewardManagement);
