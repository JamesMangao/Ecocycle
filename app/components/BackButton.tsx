"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
    >
      Back
    </button>
  );
};

export default BackButton;
