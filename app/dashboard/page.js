"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../firebase';
import withAuth from '../components/withAuth';
import WelcomePopup from '../components/WelcomePopup';
import axios from 'axios';
import { FaUsers, FaExchangeAlt, FaTrash, FaGift, FaQrcode } from 'react-icons/fa';

export const dynamic = 'force-dynamic';

const DashboardPage = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTransactions: 0,
        totalPoints: 0,
        activeBins: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showWelcome, setShowWelcome] = useState(false);
    const router = useRouter();
    const user = auth.currentUser;

     useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/stats`);
                setStats(prevStats => ({ ...prevStats, ...response.data }));
            } catch (err) {
                setError('Failed to fetch dashboard stats.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();

        const isFirstLogin = localStorage.getItem('isFirstLogin');
        if (isFirstLogin !== 'false') {
            setShowWelcome(true);
            localStorage.setItem('isFirstLogin', 'false');
        }
    }, []);

    const handleNavigation = (path) => {
        router.push(path);
    };

    const handleClosePopup = () => {
        setShowWelcome(false);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><div className="text-xl">Loading...</div></div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen"><div className="text-red-500 text-xl">{error}</div></div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {showWelcome && user && <WelcomePopup userDisplayName={user.displayName || 'Admin'} onClose={handleClosePopup} />}
            <header className="bg-white shadow-md p-4 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                <button
                    onClick={() => auth.signOut().then(() => router.push('/login'))}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                    Logout
                </button>
            </header>
            <main className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <StatCard title="Total Users" value={stats.totalUsers} />
                    <StatCard title="Total Transactions" value={stats.totalTransactions} />
                    <StatCard title="Total Points Redeemed" value={stats.totalPoints} />
                    <StatCard title="Active Bins" value={stats.activeBins} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <NavCard title="Manage Users" icon={<FaUsers />} onClick={() => handleNavigation('/users')} />
                    <NavCard title="View Transactions" icon={<FaExchangeAlt />} onClick={() => handleNavigation('/transactions')} />
                    <NavCard title="Bin Detections" icon={<FaTrash />} onClick={() => handleNavigation('/bins')} />
                    <NavCard title="Manage Rewards" icon={<FaGift />} onClick={() => handleNavigation('/rewards')} />
                    <NavCard title="Bin QR Code" icon={<FaQrcode />} onClick={() => handleNavigation('/qrcode')} />
                </div>
            </main>
        </div>
    );
};

const StatCard = ({ title, value }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-600">{title}</h2>
        <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
);

const NavCard = ({ title, icon, onClick }) => (
    <div
        onClick={onClick}
        className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:bg-gray-50 transition-colors flex items-center"
    >
        <div className="text-3xl text-gray-800 mr-4">{icon}</div>
        <div>
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-600 mt-2">Click to manage</p>
        </div>
    </div>
);

export default withAuth(DashboardPage);
