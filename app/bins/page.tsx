"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import withAuth from "../components/withAuth";
import { BackButton } from "../components/BackButton";

function BinsPage() {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBins = async () => {
      try {
        const response = await fetch("/api/admin/bins");
        if (!response.ok) {
          throw new Error("Failed to fetch bins");
        }
        const data = await response.json();
  setBins(data);
} catch (err) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("An unknown error occurred");
  }
} finally {
  setLoading(false);
}
    };

    fetchBins();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-3 items-center mb-6">
        <div>{/* Left empty space */}</div>
        <h1 className="text-3xl font-bold text-center col-span-1">
          Registered Bins
        </h1>
        <div className="flex items-center space-x-4 justify-end">
          <Link
            href="/bins/register"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Register New Bin
          </Link>
          <BackButton href="/dashboard" />
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Location</th>
              <th className="py-3 px-6 text-left">Last Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bins.map((bin) => (
              <tr key={bin.id}>
                <td className="py-4 px-6">
                  <Link
                    href={`/bins/${bin.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {bin.id}
                  </Link>
                </td>
                <td className="py-4 px-6">{bin.name}</td>
                <td className="py-4 px-6">{bin.location}</td>
                <td className="py-4 px-6">
                  {bin.lastUpdate
                    ? new Date(
                        bin.lastUpdate._seconds * 1000
                      ).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default withAuth(BinsPage);
