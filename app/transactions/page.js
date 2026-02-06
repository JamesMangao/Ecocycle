'use client';
import React, { useState, useEffect } from 'react';
import withAuth from '../components/withAuth';
import { BackButton } from '../components/BackButton';

export const dynamic = 'force-dynamic';

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadTransactions = async () => {
        try {
            const response = await fetch(`${backendURL}/api/admin/transactions`);
            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error('Error loading transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTransactions();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>
                <BackButton href="/dashboard" />
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User Name</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Details</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">Loading...</td>
                                </tr>
                            ) : transactions.length > 0 ? (
                                transactions.map(tx => (
                                    <tr key={tx.id} className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-900">{tx.userName || 'N/A'}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-900">{tx.type}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-900">{tx.timestamp && tx.timestamp._seconds ? new Date(tx.timestamp._seconds * 1000).toLocaleString() : 'Invalid Date'}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {(() => {
                                                const type = tx.type ? tx.type.toLowerCase() : '';
                                                switch (type) {
                                                    case 'redemption':
                                                        return `Redeemed: ${tx.rewardName || 'Unknown Reward'}`;
                                                    case 'bin-claim':
                                                        return `Claimed from Bin: ${tx.binId || 'Unknown'}`;
                                                    case 'qr-scan':
                                                        return `Scanned QR: ${tx.qrCodeId || 'Unknown'}`;
                                                    case 'manual-reward':
                                                        return tx.details || 'Points awarded by admin';
                                                    default:
                                                        if (typeof tx.details === 'object' && tx.details !== null) {
                                                            return JSON.stringify(tx.details);
                                                        }
                                                        return tx.details || tx.description || 'N/A';
                                                }
                                            })()}
                                        </td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-900">{tx.points}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">No transactions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default withAuth(TransactionsPage);
