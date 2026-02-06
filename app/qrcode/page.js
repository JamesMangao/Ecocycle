"use client";
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import withAuth from '../components/withAuth';
import BackButton from '../components/BackButton';

const QRCodePage = () => {
    const [binId, setBinId] = useState('');
    const [bins, setBins] = useState([]);
    const [unclaimedPoints, setUnclaimedPoints] = useState(0);

    useEffect(() => {
        const fetchBins = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/bins`);
                const binsData = response.data;
                setBins(binsData);
                if (binsData.length > 0) {
                    setBinId(binsData[0].id);
                }
            } catch (error) {
                console.error("Error fetching bins:", error);
            }
        };

        fetchBins();
    }, []);

    useEffect(() => {
        if (binId) {
            const rtdbBinId = binId.replace('-', '');
            const fetchPoints = async () => {
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/bins/${rtdbBinId}/pending-points`);
                    setUnclaimedPoints(response.data.points || 0);
                } catch (error) {
                    console.error("Error fetching unclaimed points:", error);
                    setUnclaimedPoints(0);
                }
            };

            const interval = setInterval(fetchPoints, 3000); // Poll every 3 seconds
            fetchPoints(); // Initial fetch

            return () => clearInterval(interval);
        } else {
            setUnclaimedPoints(0);
        }
    }, [binId]);

    const qrCodeValue = JSON.stringify({
        binID: binId ? binId.replace('-', '') : ''
    });

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-md p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Bin QR Code</h1>
                <BackButton href="/dashboard" />
            </header>
            <main className="p-6 flex justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <div className="mb-6">
                        <label htmlFor="binId" className="block text-lg font-medium text-gray-700 mb-2">
                            Select Bin
                        </label>
                        <select
                            id="binId"
                            value={binId}
                            onChange={(e) => setBinId(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {bins.length > 0 ? (
                                bins.map(bin => (
                                    <option key={bin.id} value={bin.id}>
                                        {bin.id}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>Loading bins...</option>
                            )}
                        </select>
                        {binId && (
                            <div className="mt-4 text-center p-3 bg-gray-50 rounded-md">
                                <p className="text-lg font-medium text-gray-800">
                                    Unclaimed Points: <span className="font-bold text-blue-600">{unclaimedPoints}</span>
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center mb-6">
                        {binId && <QRCodeSVG value={qrCodeValue} size={256} />}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default withAuth(QRCodePage);
