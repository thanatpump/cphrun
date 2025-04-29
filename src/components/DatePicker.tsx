import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DatePickerProps {
  onChange: (date: string) => void;
}

export default function DatePicker({ onChange }: DatePickerProps) {
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  // สร้างปี พ.ศ. ย้อนหลัง 100 ปี
  const years = Array.from({ length: 100 }, (_, i) => {
    const year = new Date().getFullYear() - i + 543;
    return year.toString();
  });

  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const getDaysInMonth = (year: string, month: string) => {
    const monthIndex = months.indexOf(month);
    if (monthIndex === -1) return [];
    // แปลง พ.ศ. เป็น ค.ศ.
    const christianYear = parseInt(year) - 543;
    const daysInMonth = new Date(christianYear, monthIndex + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString().padStart(2, '0'));
  };

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    setShowYearPicker(false);
    setShowMonthPicker(true);
  };

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
    setShowMonthPicker(false);
    setSelectedDay('');
  };

  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
    const monthIndex = (months.indexOf(selectedMonth) + 1).toString().padStart(2, '0');
    const christianYear = (parseInt(selectedYear) - 543).toString();
    const formattedDate = `${christianYear}-${monthIndex}-${day}`;
    onChange(formattedDate);
  };

  const formatDisplayDate = () => {
    if (!selectedYear) return 'เลือกวันเกิด';
    if (!selectedMonth) return `ปี ${selectedYear}`;
    if (!selectedDay) return `${selectedMonth} ${selectedYear}`;
    return `${selectedDay} ${selectedMonth} ${selectedYear}`;
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowYearPicker(true)}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-left"
      >
        {formatDisplayDate()}
      </button>

      <AnimatePresence>
        {showYearPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            <div className="grid grid-cols-4 gap-1 p-2">
              {years.map(year => (
                <button
                  key={year}
                  onClick={() => handleYearSelect(year)}
                  className="p-2 text-center hover:bg-red-100 rounded"
                >
                  {year}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {showMonthPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg"
          >
            <div className="grid grid-cols-3 gap-1 p-2">
              {months.map(month => (
                <button
                  key={month}
                  onClick={() => handleMonthSelect(month)}
                  className="p-2 text-center hover:bg-red-100 rounded"
                >
                  {month}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {selectedMonth && !showYearPicker && !showMonthPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg"
          >
            <div className="grid grid-cols-7 gap-1 p-2">
              {getDaysInMonth(selectedYear, selectedMonth).map(day => (
                <button
                  key={day}
                  onClick={() => handleDaySelect(day)}
                  className="p-2 text-center hover:bg-red-100 rounded"
                >
                  {day}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 