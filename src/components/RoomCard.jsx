import React, { useState, useEffect } from 'react';

const RoomCard = ({ room, onSelectRoom }) => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="bg-white rounded-xl shadow-md p-6 m-4 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center justify-between min-w-[250px] max-w-sm w-full md:w-1/3 lg:w-1/4"
      onClick={() => onSelectRoom(room)}
    >
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{room.name}</h3>
      <p className="text-gray-600 text-lg mb-4">ความจุ: {room.capacity} คน</p>
      <p className="text-gray-500 text-sm mb-4">เวลาปัจจุบัน: {currentTime}</p>
      <button
        onClick={() => onSelectRoom(room)}
        className="mt-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        ดูตารางเวลา / จอง
      </button>
    </div>
  );
};

export default RoomCard;
