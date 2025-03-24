import React from 'react';

const DashboardPage = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Machines</h1>
        <div className="flex items-center space-x-4">
          <p className="text-gray-500">Mon 5 Aug, 4:11 PM</p>
          <select className="bg-white border border-gray-300 rounded-lg px-3 py-2">
            <option>Monthly</option>
            <option>Weekly</option>
            <option>Daily</option>
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 md:col-span-3">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500">Total Bookings</p>
            <h2 className="text-3xl font-bold">41</h2>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500">Total Projects</p>
            <h2 className="text-3xl font-bold">2</h2>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500">Your Rating</p>
            <h2 className="text-3xl font-bold">2.1</h2>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white p-6 rounded-lg shadow col-span-2 relative">
          <h3 className="text-gray-500 mb-4">Performance Chart</h3>
          <div className="absolute top-0 right-0 mt-4 mr-4">
            <select className="bg-white border border-gray-300 rounded-lg px-3 py-2">
              <option>Monthly</option>
              <option>Weekly</option>
              <option>Daily</option>
            </select>
          </div>
          <div className="flex space-x-2">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className={`w-6 h-24 bg-gray-300 rounded-lg ${
                  index === 4
                    ? 'bg-red-500'
                    : index === 8
                      ? 'bg-orange-500'
                      : ''
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Upcoming Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 mb-4">Upcoming</h3>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="font-bold">3D Printer Creality 333XP</p>
            <p className="text-gray-500 text-sm">at SOA Fab Lab</p>
            <p className="text-gray-500 text-sm">25 Oct 2024</p>
          </div>
        </div>

        {/* Most Used/Visited Sections */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 mb-4">Most Visited Spaces</h3>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <span className="bg-pink-500 w-3 h-3 rounded-full"></span>
              <p>SOA Fab Lab, Bhubaneswar, Odisha</p>
            </li>
            <li className="flex items-center space-x-2">
              <span className="bg-pink-500 w-3 h-3 rounded-full"></span>
              <p>SOA Fab Lab, Bhubaneswar, Odisha</p>
            </li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 mb-4">Most Used Machines</h3>
          <ul className="space-y-2">
            <li>
              <input
                type="radio"
                id="3d-printer"
                name="machine"
                className="mr-2"
              />
              <label htmlFor="3d-printer">3D Printer Creality 3D</label>
            </li>
            <li>
              <input
                type="radio"
                id="laser-cutter"
                name="machine"
                className="mr-2"
              />
              <label htmlFor="laser-cutter">Laser Cutter Brand Name</label>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
