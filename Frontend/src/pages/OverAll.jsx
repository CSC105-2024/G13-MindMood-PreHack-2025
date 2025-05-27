import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/UI/Navbar';

const API_BASE_URL = 'http://localhost:3000';

axios.defaults.baseURL = API_BASE_URL;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function OverAll() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all submissions when component mounts
  useEffect(() => {
    fetchAllSubmissions();
  }, []);

  const fetchAllSubmissions = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/activities/submissions/all');
      setSubmissions(response.data.submissions || []);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to fetch submissions');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const weeks = {
    1: [1, 2, 3, 4, 5, 6, 7],
    2: [1, 2, 3, 4, 5, 6, 7],
    3: [1, 2, 3, 4, 5, 6, 7],
    4: [1, 2, 3, 4, 5, 6, 7],
  };

  const dayNames = {
    1: 'Monday',
    2: 'Tuesday', 
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    7: 'Sunday'
  };

  // Get submission for specific week and day
  const getSubmissionForDay = (week, day) => {
    return submissions.find(sub => sub.week === week && sub.day === day);
  };

  // Check if day has submission
  const hasSubmission = (week, day) => {
    return getSubmissionForDay(week, day) !== undefined;
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

  const handleDayClick = (dayNumber) => {
    setSelectedDay(dayNumber);
  };

  const renderSubmissionDetails = () => {
    if (!selectedDay) {
      return <p className="text-gray-500">Select a day to see information.</p>;
    }

    const submission = getSubmissionForDay(currentWeek, selectedDay);
    const dayName = dayNames[selectedDay];

    if (!submission) {
      return (
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-amber-800 mb-4">
            {dayName} - Week {currentWeek}, Day {selectedDay}
          </h2>
          <div className="bg-amber-200 p-4 rounded-lg">
            <p className="text-amber-800">No submission found for this day.</p>
            <p className="text-amber-700 text-sm mt-2">
              Complete all activities for this day and submit to see the mood summary.
            </p>
          </div>
        </div>
      );
    }

    // Parse activities data
    let activities = [];
    try {
      activities = JSON.parse(submission.activitiesData || '[]');
    } catch (e) {
      console.error('Error parsing activities data:', e);
    }

    return (
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-amber-800 mb-4">
          {dayName} - Week {currentWeek}, Day {selectedDay}
        </h2>
        
        {/* Overall Mood Summary */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
          <div className="text-center mb-4">
            <div className="text-3xl md:text-4xl mb-2">
              {submission.overallMood === 'Calm' && '😌'}
              {submission.overallMood === 'Neutral' && '😐'}
              {submission.overallMood === 'Stressed' && '😰'}
            </div>
            <div className="text-xl md:text-2xl font-bold text-gray-700">{submission.overallMood}</div>
            <p className="text-gray-600 mt-2 text-sm md:text-base">{submission.overallMessage}</p>
          </div>

          {/* Mood Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4">
            <div className="text-center p-3 bg-green-100 rounded-lg">
              <div className="text-sm md:text-lg font-semibold text-green-700">Calm</div>
              <div className="text-xl md:text-2xl font-bold text-green-800">{submission.calmPercentage}%</div>
              <div className="text-xs md:text-sm text-green-600">{submission.calmCount} activities</div>
            </div>
            <div className="text-center p-3 bg-amber-100 rounded-lg">
              <div className="text-sm md:text-lg font-semibold text-amber-700">Neutral</div>
              <div className="text-xl md:text-2xl font-bold text-amber-800">{submission.neutralPercentage}%</div>
              <div className="text-xs md:text-sm text-amber-600">{submission.neutralCount} activities</div>
            </div>
            <div className="text-center p-3 bg-red-100 rounded-lg">
              <div className="text-sm md:text-lg font-semibold text-red-700">Stressed</div>
              <div className="text-xl md:text-2xl font-bold text-red-800">{submission.stressedPercentage}%</div>
              <div className="text-xs md:text-sm text-red-600">{submission.stressedCount} activities</div>
            </div>
          </div>

          <div className="text-center text-gray-600 text-sm md:text-base">
            Total Activities: {submission.totalActivities}
          </div>
        </div>

        {/* Activities List */}
        {activities.length > 0 && (
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Activities Completed</h3>
            <div className="space-y-3">
              {activities.map((activity, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg gap-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-3"></div>
                    <span className="font-medium text-sm md:text-base">{activity.name}</span>
                    {activity.completed && (
                      <span className="ml-2 text-green-600 text-xs md:text-sm">✓ Completed</span>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium self-start sm:self-auto ${
                    activity.mood === 'Calm' ? 'bg-green-200 text-green-800' :
                    activity.mood === 'Neutral' ? 'bg-amber-200 text-amber-800' :
                    'bg-red-200 text-red-800'
                  }`}>
                    {activity.mood}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submission Date */}
        <div className="mt-4 text-xs md:text-sm text-gray-500">
          Submitted on: {new Date(submission.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="p-4 md:p-10 py-6 md:py-25 bg-amber-50 min-h-screen">
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="text-center py-4 mb-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* Left: Week Controls + Day Buttons */}
          <div className="flex flex-col gap-4 lg:min-w-0 lg:w-auto">
            {/* Week Pagination Controls */}
            <div className="flex justify-between items-center mb-4 gap-2">
              <button
                onClick={handlePrevWeek}
                disabled={currentWeek === 1}
                className="px-3 md:px-4 py-2 bg-amber-700 text-white rounded disabled:opacity-50 text-sm md:text-base"
              >
                Previous
              </button>
              <span className="text-lg md:text-xl font-semibold">Week {currentWeek}</span>
              <button
                onClick={handleNextWeek}
                disabled={currentWeek === Object.keys(weeks).length}
                className="px-3 md:px-4 py-2 bg-amber-700 text-white rounded disabled:opacity-50 text-sm md:text-base"
              >
                Next
              </button>
            </div>

            {/* Day Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-3 lg:gap-4">
              {weeks[currentWeek].map((dayNumber) => (
                <button
                  key={dayNumber}
                  onClick={() => handleDayClick(dayNumber)}
                  className={`p-3 lg:p-5 text-lg lg:text-2xl px-4 lg:px-20 rounded-xl lg:rounded-2xl text-white hover:brightness-110 relative ${
                    selectedDay === dayNumber 
                      ? 'bg-amber-800' 
                      : hasSubmission(currentWeek, dayNumber)
                        ? 'bg-amber-600'
                        : 'bg-gray-400'
                  }`}
                >
                  Day {dayNumber}
                  {hasSubmission(currentWeek, dayNumber) && (
                    <div className="absolute top-1 lg:top-2 right-1 lg:right-2 w-2 lg:w-3 h-2 lg:h-3 bg-green-400 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info Panel */}
          <div className="flex-1 p-4 md:p-8 bg-amber-100 rounded-xl shadow-md">
            {renderSubmissionDetails()}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 lg:mt-10 bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Week {currentWeek} Summary</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="text-center p-3 bg-blue-100 rounded-lg">
              <div className="text-sm md:text-lg font-semibold text-blue-700">Total Days</div>
              <div className="text-xl md:text-2xl font-bold text-blue-800">7</div>
            </div>
            <div className="text-center p-3 bg-green-100 rounded-lg">
              <div className="text-sm md:text-lg font-semibold text-green-700">Submitted</div>
              <div className="text-xl md:text-2xl font-bold text-green-800">
                {submissions.filter(sub => sub.week === currentWeek).length}
              </div>
            </div>
            <div className="text-center p-3 bg-amber-100 rounded-lg">
              <div className="text-sm md:text-lg font-semibold text-amber-700">Pending</div>
              <div className="text-xl md:text-2xl font-bold text-amber-800">
                {7 - submissions.filter(sub => sub.week === currentWeek).length}
              </div>
            </div>
            <div className="text-center p-3 bg-purple-100 rounded-lg">
              <div className="text-sm md:text-lg font-semibold text-purple-700">Completion</div>
              <div className="text-xl md:text-2xl font-bold text-purple-800">
                {Math.round((submissions.filter(sub => sub.week === currentWeek).length / 7) * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OverAll;