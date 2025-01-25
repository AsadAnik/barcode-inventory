import React from 'react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Inventory Management System</h1>
      <div className="space-x-4">
        <Link href="/scanner">
          <span className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600">Go to Barcode Scanner</span>
        </Link>
        <Link href="/kanban">
          <span className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600">Go to Kanban Board</span>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;