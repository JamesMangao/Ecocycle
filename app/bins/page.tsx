// app/bins/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import withAuth from "../components/withAuth";
import { BackButton } from "../components/BackButton";

interface Bin {
  id: string;
  name: string;
  location: string;
  status: string;
}

function BinsPage() {
  const [bins, setBins] = useState<Bin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // <-- important

  useEffect(() => {
    const fetchBins = async () => {
      try {
        const res = await fetch("/api/bins");
        if (!res.ok) {
          throw new Error("Failed to fetch bins");
        }
        const data: Bin[] = await res.json();
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
    return (
      <div className="p-6">
        <p>Loading bins...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Bins</h1>
          <BackButton href="/dashboard" />
        </div>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Bins</h1>
        <BackButton href="/dashboard" />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                ID
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                Location
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {bins.map((bin) => (
              <tr key={bin.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-800 border-b">
                  {bin.id}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800 border-b">
                  {bin.name}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800 border-b">
                  {bin.location}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800 border-b">
                  {bin.status}
                </td>
              </tr>
            ))}
            {bins.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-4 text-sm text-gray-500 text-center"
                >
                  No bins found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default withAuth(BinsPage);
