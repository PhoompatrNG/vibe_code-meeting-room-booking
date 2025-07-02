import React, { useState } from 'react';
import RoomList from './components/RoomList';
import BookingCalendar from './components/BookingCalendar';
import MessageModal from './components/MessageModal';
import './App.css';

export default function App() {
  const [rooms, setRooms] = useState([
    { id: 'R001', name: 'ห้องประชุมใหญ่', capacity: 20 },
    { id: 'R002', name: 'ห้องประชุมย่อย 1', capacity: 10 },
    { id: 'R003', name: 'ห้องประชุมย่อย 2', capacity: 8 },
  ]);
  const [bookings, setBookings] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [message, setMessage] = useState('');

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
  };

  const handleGoBack = () => {
    setSelectedRoom(null);
  };

  const handleAddBooking = (newBooking) => {
    setBookings([...bookings, newBooking]);
    setMessage('จองห้องเรียบร้อยแล้ว!');
  };

  const handleUpdateBooking = (updatedBooking) => {
    setBookings(bookings.map(b => (b.id === updatedBooking.id ? updatedBooking : b)));
    setMessage('แก้ไขการจองเรียบร้อยแล้ว!');
  };

  const handleDeleteBooking = (id) => {
    setBookings(bookings.filter(b => b.id !== id));
    setMessage('ลบการจองเรียบร้อยแล้ว!');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4 font-sans">
      <h1 className="text-5xl font-extrabold text-blue-700 mb-10 text-center">ระบบจองห้องประชุม</h1>

      {selectedRoom ? (
        <div className="w-full max-w-5xl">
          <button
            onClick={handleGoBack}
            className="mb-6 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-200 ease-in-out flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            กลับไปหน้ารายการห้อง
          </button>
          <BookingCalendar
            room={selectedRoom}
            bookings={bookings.filter(b => b.roomId === selectedRoom.id)}
            onAddBooking={handleAddBooking}
            onUpdateBooking={handleUpdateBooking}
            onDeleteBooking={handleDeleteBooking}
          />
        </div>
      ) : (
        <RoomList rooms={rooms} onSelectRoom={handleSelectRoom} />
      )}
      <MessageModal message={message} onClose={() => setMessage('')} />
    </div>
  );
}
