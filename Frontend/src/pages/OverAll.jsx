import React, { useState } from 'react';
import Navbar from '../components/UI/Navbar';

function OverAll() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(1);

  const weeks = {
    1: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    2: ["Mon W2", "Tue W2", "Wed W2", "Thu W2", "Fri W2", "Sat W2", "Sun W2"],
    3: ["Mon W3", "Tue W3", "Wed W3", "Thu W3", "Fri W3", "Sat W3", "Sun W3"],
    // Add more weeks if needed
  };

  const info = {
    "Monday": "Monday is the first day of the work week.",
    "Tuesday": "Tuesday comes after Monday.",
    "Wednesday": "Midweek day, also called hump day!",
    "Thursday": "Almost Friday!",
    "Friday": "Last working day for most!",
    "Saturday": "Weekend vibes start here.",
    "Sunday": "A day to rest and recharge.",
    "Mon W2": "Week 2 - Monday's notes.",
    "Tue W2": "Week 2 - Tuesday's summary.",
    "Mon W3": "Week 3 - Kicking things off again.",
    // Add info for additional weeks/days as needed
  };

  const handleNextWeek = () => {
    if (currentWeek < Object.keys(weeks).length) {
      setCurrentWeek(currentWeek + 1);
      setSelectedDay(null);
    }
  };

  const handlePrevWeek = () => {
    if (currentWeek > 1) {
      setCurrentWeek(currentWeek - 1);
      setSelectedDay(null);
    }
  };

  return (
    <>
    <Navbar />
    <div className="p-10 py-25 bg-amber-50 min-h-screen">
      <div className="flex gap-10">
        {/* Left: Week Controls + Day Buttons */}
        <div className="flex flex-col gap-4">
          {/* Week Pagination Controls */}
          <div className="flex justify-between items-center mb-4 gap-2">
            <button
              onClick={handlePrevWeek}
              disabled={currentWeek === 1}
              className="px-4 py-2 bg-amber-700 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-xl font-semibold">Week {currentWeek}</span>
            <button
              onClick={handleNextWeek}
              disabled={currentWeek === Object.keys(weeks).length}
              className="px-4 py-2 bg-amber-700 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* Day Buttons */}
          {weeks[currentWeek].map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className="p-5 text-2xl px-20 rounded-2xl bg-amber-600 text-white hover:bg-amber-700"
            >
              {day}
            </button>
          ))}
        </div>

        {/* Right: Info Panel */}
        <div className="flex-1 p-8 bg-amber-100 rounded-xl shadow-md">
          {selectedDay ? (
            <>
              <h2 className="text-3xl font-bold text-amber-800 mb-4">{selectedDay}</h2>
              <p className="text-lg text-amber-900">{info[selectedDay] || "No info available for this day."}</p>
            </>
          ) : (
            <p className="text-gray-500">Select a day to see information.</p>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default OverAll;
