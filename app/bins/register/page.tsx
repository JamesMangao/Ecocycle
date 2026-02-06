"use client";
import { useState } from "react";
import withAuth from "../../components/withAuth";
import Link from "next/link";
import { BackButton } from '../../components/BackButton';

function RegisterBin() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !location) {
      setError("Name and location are required.");
      return;
    }

    try {
      const response = await fetch("/api/admin/bins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, location }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to register bin.");
      }

      setSuccess("Bin registered successfully!");
      setName("");
      setLocation("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="w-full max-w-lg px-4">
        <div className="flex justify-between items-center mb-6">
          <BackButton href="/dashboard" />
          <h1 className="text-3xl font-bold text-gray-800">Register New Bin</h1>
          <Link href="/bins" className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
            View All Bins
          </Link>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                Bin Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Main Lobby Bin"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="location" className="block text-gray-700 font-bold mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 1st Floor, near entrance"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-bold"
            >
              Register Bin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default withAuth(RegisterBin);
