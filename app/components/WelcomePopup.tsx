'use client';

import { X } from 'lucide-react';
import React from 'react';

interface WelcomePopupProps {
  userDisplayName: string;
  onClose: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ userDisplayName, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full transform transition-all scale-95 hover:scale-100">
                <div className="flex justify-between items-center border-b-2 border-gray-100 pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Welcome, {userDisplayName}!</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>
                <div className="mt-6">
                    <p className="text-gray-600 mb-4">
                        This is your central hub for managing the EcoCycle application. Here’s a quick overview of what you can do:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li><span className="font-semibold">Generate QR Codes:</span> Create new QR codes for users to scan and earn points.</li>
                        <li><span className="font-semibold">View Transactions:</span> Monitor all user transactions, including point earnings and redemptions.</li>
                        <li><span className="font-semibold">Manage Users:</span> View and manage all registered users of the application.</li>
                        <li><span className="font-semibold">Oversee Bins:</span> Keep track of recycling bin locations and statuses.</li>
                        <li><span className="font-semibold">Administer Rewards:</span> Add, edit, or remove rewards available for redemption.</li>
                    </ul>
                    <p className="text-gray-600 mt-6">
                        Use the navigation cards below to get started. If you have any questions, please refer to the documentation.
                    </p>
                </div>
                <div className="mt-8 text-right">
                    <button
                        onClick={onClose}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WelcomePopup;
