"use client";
import React from 'react';
import withAuth from '../../components/withAuth';
import { BackButton } from '../../components/BackButton';
import { usePathname } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Detection {
  id: string;
  wasteType: string;
  confidence: number;
  points: number;
  timestamp: string;
}

const BinDetectionsPage = () => {
  const pathname = usePathname();
  const binId = pathname.split('/').pop() || '';
  const [detections, setDetections] = React.useState<Detection[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!binId) return;

    const fetchDetections = async () => {
      try {
        // Correct the binId format to match the Realtime Database ("BIN-001" -> "BIN001")
        const correctedBinId = binId.replace('-', '');
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/bins/${correctedBinId}/detections`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch detections');
        }
        const data = await response.json();
        const formattedDetections = data.map((detection: any) => ({
          ...detection,
          id: detection.id,
          timestamp: new Date(detection.timestamp).toLocaleString(),
        })).sort((a: Detection, b: Detection) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setDetections(formattedDetections);
      } catch (err) {
        setError('Failed to fetch detection data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetections();
  }, [binId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="text-xl">Loading...</div></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen"><div className="text-red-500 text-xl">{error}</div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div style={{ width: 88 }} />
        <h1 className="text-2xl font-bold text-gray-800">Detections for {binId}</h1>
        <BackButton href="/dashboard" />
      </header>
      <main className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Waste Type</th>
                <th className="py-3 px-4 text-left">Confidence</th>
                <th className="py-3 px-4 text-left">Points</th>
                <th className="py-3 px-4 text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {detections.length > 0 ? (
                detections.map((detection, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-4">{detection.wasteType}</td>
                    <td className="py-3 px-4">{(detection.confidence * 100).toFixed(2)}%</td>
                    <td className="py-3 px-4">{detection.points}</td>
                    <td className="py-3 px-4">{detection.timestamp}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-3 px-4 text-center">No detections found for this bin.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default withAuth(BinDetectionsPage);
