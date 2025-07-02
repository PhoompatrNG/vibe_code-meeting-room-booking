import React, { useState } from 'react';
import BookingForm from './BookingForm';
import MessageModal from './MessageModal';
import { timeToMinutes } from '../utils/timeUtils';

const BookingCalendar = ({ room, bookings, onAddBooking, onUpdateBooking, onDeleteBooking, allBookings = [] }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [message, setMessage] = useState('');

  const timelineStartHour = 8;
  const timelineEndHour = 18;
  const totalTimelineMinutes = (timelineEndHour - timelineStartHour) * 60;

  const dailyBookings = bookings.filter(booking => booking.date === selectedDate);

  const getBookingBarProps = (booking) => {
    const startMinutes = timeToMinutes(booking.startTime);
    const endMinutes = timeToMinutes(booking.endTime);

    const relativeStartMinutes = startMinutes - (timelineStartHour * 60);
    const durationMinutes = endMinutes - startMinutes;

    const leftPercentage = (relativeStartMinutes / totalTimelineMinutes) * 100;
    const widthPercentage = (durationMinutes / totalTimelineMinutes) * 100;

    return {
      left: `${leftPercentage}%`,
      width: `${widthPercentage}%`,
      title: `${booking.title} (${booking.bookedBy}) ${booking.startTime}-${booking.endTime}`
    };
  };

  const handleOpenNewBookingForm = () => {
    setEditingBooking(null);
    setShowBookingForm(true);
  };

  const handleEditBookingClick = (booking) => {
    setEditingBooking(booking);
    setShowBookingForm(true);
  };

  const handleSubmitBooking = async (bookingData, bookingId) => {
    const newStartMinutes = timeToMinutes(bookingData.startTime);
    const newEndMinutes = timeToMinutes(bookingData.endTime);

    const hasConflict = allBookings.some(existingBooking => {
      if (bookingId && existingBooking.id === bookingId) return false;

      if (existingBooking.roomId === bookingData.roomId && existingBooking.date === bookingData.date) {
        const existingStartMinutes = timeToMinutes(existingBooking.startTime);
        const existingEndMinutes = timeToMinutes(existingBooking.endTime);

        return (
          (newStartMinutes < existingEndMinutes && newEndMinutes > existingStartMinutes)
        );
      }
      return false;
    });

    if (hasConflict) {
      throw new Error('ช่วงเวลาที่เลือกมีการจองอยู่แล้ว โปรดเลือกเวลาอื่น');
    }

    if (bookingId) {
      await onUpdateBooking(bookingId, bookingData);
    } else {
      await onAddBooking(bookingData);
    }
  };

  const generateHourlyLabels = () => {
    const labels = [];
    for (let hour = timelineStartHour; hour <= timelineEndHour; hour++) {
      labels.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return labels;
  };

  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-lg mt-8 max-w-4xl mx-auto w-full">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">ตารางการใช้งานห้อง: {room.name}</h2>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-lg w-full sm:w-auto"
        />
        <button
          onClick={handleOpenNewBookingForm}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 w-full sm:w-auto"
        >
          + จองห้อง
        </button>
      </div>

      <div className="relative border border-gray-300 rounded-lg bg-white p-4 overflow-x-auto min-h-[150px] flex flex-col justify-between">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          {generateHourlyLabels().map((label, index) => (
            <span key={index} className="flex-1 text-center relative">
              {label}
              {index < generateHourlyLabels().length - 1 && (
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gray-200"></div>
              )}
            </span>
          ))}
        </div>

        <div className="relative h-20 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
          <div className="absolute inset-0 flex">
            {Array.from({ length: totalTimelineMinutes / 30 }).map((_, i) => (
              <div
                key={i}
                className={`h-full w-[calc(100%/${totalTimelineMinutes/30})] ${i % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'} border-r border-gray-200`}
              ></div>
            ))}
          </div>

          {dailyBookings.map(booking => {
            const { left, width, title } = getBookingBarProps(booking);
            return (
              <div
                key={booking.id}
                className="absolute h-full bg-blue-500 bg-opacity-75 rounded-md flex items-center justify-center text-white text-xs p-1 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out hover:bg-blue-600 hover:bg-opacity-90 cursor-pointer"
                style={{ left, width }}
                title={title}
                onClick={() => handleEditBookingClick(booking)}
              >
                <span className="truncate">{booking.title} ({booking.bookedBy})</span>
              </div>
            );
          })}
        </div>
      </div>

      {showBookingForm && (
        <BookingForm
          room={room}
          selectedDate={selectedDate}
          initialBooking={editingBooking}
          onClose={() => setShowBookingForm(false)}
          onSubmit={handleSubmitBooking}
          onDelete={onDeleteBooking}
        />
      )}
      <MessageModal message={message} onClose={() => setMessage('')} />
    </div>
  );
};

export default BookingCalendar;
