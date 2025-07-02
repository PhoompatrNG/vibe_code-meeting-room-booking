import React from 'react';
import RoomCard from './RoomCard';

const RoomList = ({ rooms, onSelectRoom }) => {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">เลือกห้องประชุม</h2>
      <div className="flex flex-wrap justify-center -m-4">
        {rooms.map(room => (
          <RoomCard key={room.id} room={room} onSelectRoom={onSelectRoom} />
        ))}
      </div>
    </div>
  );
};

export default RoomList;
