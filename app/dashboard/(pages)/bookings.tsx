import React from 'react';

const BookingComponent = () => {
  const bookings = [
    {
      id: 1,
      orderId: 'KAHR-3D000X001',
      machine: '3d Printer Creality 333XP',
      location: 'at SOA Fab Lab',
      amount: '₹100',
      rating: 4.5,
      status: 'COMPLETED',
      statusColor: 'green',
      paymentStatus: 'Pending Payment',
      date: '10 Oct 2024',
    },
    {
      id: 2,
      orderId: 'KAHR-3D000X001',
      machine: '3d Printer Creality 333XP',
      location: 'at SOA Fab Lab',
      amount: '₹100',
      rating: null,
      status: 'ONGOING',
      statusColor: 'gray',
      paymentStatus: 'Paid by UPI',
      date: '10 Oct 2024',
    },
    {
      id: 3,
      orderId: 'KAHR-3D000X001',
      machine: '3d Printer Creality 333XP',
      location: 'at SOA Fab Lab',
      amount: '₹350',
      rating: null,
      status: 'UPCOMING',
      statusColor: 'yellow',
      paymentStatus: 'Paid by Card',
      date: '25 Oct 2024',
    },
    {
      id: 4,
      orderId: 'KAHR-3D000X001',
      machine: '3d Printer Creality 333XP',
      location: 'at SOA Fab Lab',
      amount: '₹250',
      rating: null,
      status: 'REQUESTED',
      statusColor: 'blue',
      paymentStatus: 'Paid by UPI',
      date: '25 Oct 2024',
    },
    {
      id: 5,
      orderId: 'KAHR-3D000X001',
      machine: '3d Printer Creality 333XP',
      location: 'at SOA Fab Lab',
      amount: '₹250',
      rating: null,
      status: 'CANCELLED',
      statusColor: 'red',
      paymentStatus: 'Refund Processed',
      date: '25 Oct 2024',
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

      <h2 className="text-xl font-semibold mb-4">All Bookings</h2>
      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-6 text-gray-500 font-bold p-4 border-b">
          <span>Name</span>
          <span>Amount</span>
          <span>Rating</span>
          <span>Status</span>
          <span>Date</span>
          <span></span>
        </div>

        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="grid grid-cols-6 items-center p-4 border-b hover:bg-gray-50"
          >
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4"></div>
              <div>
                <p className="font-bold">{booking.machine}</p>
                <p className="text-sm text-gray-500">{booking.location}</p>
                <p className="text-sm text-gray-500">
                  Order ID: {booking.orderId}
                </p>
              </div>
            </div>
            <p className="font-semibold">{booking.amount}</p>
            <p className="text-red-500">
              {booking.rating ? `${booking.rating}★` : '-'}
            </p>
            <div className="flex items-center">
              <span
                className={`px-3 py-1 rounded-lg text-white text-sm bg-${booking.statusColor}-500`}
              >
                {booking.status}
              </span>
              {['ONGOING', 'UPCOMING'].includes(booking.status) && (
                <button className="ml-4 text-blue-500 text-sm">
                  Add Hours
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500">{booking.date}</p>
            <button className="text-gray-500 hover:text-black">
              <span>→</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingComponent;
