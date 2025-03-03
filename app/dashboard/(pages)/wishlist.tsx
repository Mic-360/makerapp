import Image from "next/image";
import React from "react";

const Wishlist = () => {
  const machines = [
    {
      id: 1,
      name: "Creality, 3-D Printer",
      location: "SOA Fab Lab, Bhubaneswar",
      specs: "PLA, ABS, Volume",
      rating: 2.5,
      image:
        "https://via.placeholder.com/300x200.png?text=3D+Printer", // Placeholder image
    },
    {
      id: 2,
      name: "Creality, 3-D Printer",
      location: "SOA Fab Lab, Bhubaneswar",
      specs: "PLA, ABS, Volume",
      rating: 2.5,
      image:
        "https://via.placeholder.com/300x200.png?text=3D+Printer", // Placeholder image
    },
    {
      id: 3,
      name: "Creality, 3-D Printer",
      location: "SOA Fab Lab, Bhubaneswar",
      specs: "PLA, ABS, Volume",
      rating: 2.5,
      image:
        "https://via.placeholder.com/300x200.png?text=3D+Printer", // Placeholder image
    },
  ];

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {machines.map((machine) => (
          <div
            key={machine.id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <Image
              src={machine.image}
              alt={machine.name}
              className="w-full h-48 object-cover"
              height={100}
              width={100}
            />
            <div className="p-4">
              <h3 className="text-lg font-bold">{machine.name}</h3>
              <p className="text-sm text-gray-500">{machine.location}</p>
              <p className="text-sm text-gray-500">{machine.specs}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="flex items-center text-sm text-red-500 font-bold">
                  {machine.rating}★
                </span>
                <button className="bg-black text-white px-4 py-2 text-sm rounded-lg">
                  BOOK NOW
                </button>
              </div>
              <p className="text-sm text-blue-500 mt-2 cursor-pointer">
                Show More
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
