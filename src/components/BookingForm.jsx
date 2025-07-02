import React, { useState } from 'react';
import MessageModal from './MessageModal';

const BookingForm = ({ room, selectedDate, initialBooking, onClose, onSubmit, onDelete }) => {
  const [title, setTitle] = useState(initialBooking ? initialBooking.title : '');
  const [bookedBy, setBookedBy] = useState(initialBooking ? initialBooking.bookedBy : '');
  const [startTime, setStartTime] = useState(initialBooking ? initialBooking.startTime : '');
  const [endTime, setEndTime] = useState(initialBooking ? initialBooking.endTime : '');
  const [date, setDate] = useState(selectedDate || new Date().toISOString().split('T')[0]);
  const [message, setMessage] = useState('');

  const isEditing = !!initialBooking;

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour <= 18; hour++) {
      options.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 18) {
        options.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return options;
  };
  const timeOptions = generateTimeOptions();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !bookedBy || !startTime || !endTime || !date) {
      setMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (startTime >= endTime) {
      setMessage('เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น');
      return;
    }

    const bookingData = {
      roomId: room.id,
      date,
      startTime,
      endTime,
      title,
      bookedBy,
    };

    try {
      await onSubmit(bookingData, initialBooking ? initialBooking.id : null);
      onClose();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('คุณต้องการลบการจองนี้หรือไม่?')) {
      try {
        await onDelete(initialBooking.id);
        onClose();
      } catch (error) {
        setMessage(error.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">{isEditing ? 'แก้ไขการจอง' : 'จองห้อง'}: {room.name}</h3>
        <div>
          <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">วันที่:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            required
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">หัวข้อการประชุม:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="bookedBy" className="block text-gray-700 text-sm font-bold mb-2">ผู้จอง:</label>
            <input
              type="text"
              id="bookedBy"
              value={bookedBy}
              onChange={(e) => setBookedBy(e.target.value)}
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="startTime" className="block text-gray-700 text-sm font-bold mb-2">เวลาเริ่มต้น:</label>
            <select
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="shadow border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              required
            >
              <option value="">เลือกเวลา</option>
              {timeOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="endTime" className="block text-gray-700 text-sm font-bold mb-2">เวลาสิ้นสุด:</label>
            <select
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="shadow border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              required
            >
              <option value="">เลือกเวลา</option>
              {timeOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
              >
                ลบ
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-full transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-75"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
            >
              {isEditing ? 'บันทึกการแก้ไข' : 'ยืนยันการจอง'}
            </button>
          </div>
        </form>
        <MessageModal message={message} onClose={() => setMessage('')} />
      </div>
    </div>
  );
};

export default BookingForm;
