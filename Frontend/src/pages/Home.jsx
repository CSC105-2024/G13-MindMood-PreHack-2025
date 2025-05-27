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

const Home = () => {
  const [week, setWeek] = useState(1);
  const [day, setDay] = useState(1);
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState('');
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [editText, setEditText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Mood summary states
  const [showMoodSummary, setShowMoodSummary] = useState(false);
  const [moodSummary, setMoodSummary] = useState(null);
  const [daySubmitted, setDaySubmitted] = useState(false);

  // Clear modal states
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearType, setClearType] = useState(''); // 'day' or 'all'

  // Fetch activities when week or day changes
  useEffect(() => {
    fetchActivities();
    checkDaySubmissionStatus();
  }, [week, day]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`/api/activities?week=${week}&day=${day}`);
      setActivities(response.data.activities || []);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to fetch activities');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  // Check if current day has been submitted
  const checkDaySubmissionStatus = async () => {
    try {
      const response = await axios.get(`/api/activities/submission?week=${week}&day=${day}`);
      setDaySubmitted(!!response.data.submission);
    } catch (err) {
      // If 404, day hasn't been submitted yet
      if (err.response?.status === 404) {
        setDaySubmitted(false);
      } else {
        console.error('Error checking submission status:', err);
      }
    }
  };

  const clampDayWeek = (nextDay, nextWeek) => {
    let newDay = nextDay;
    let newWeek = nextWeek;

    if (newDay > 7) {
      newDay = 1;
      newWeek = newWeek < 4 ? newWeek + 1 : 1;
    } else if (newDay < 1) {
      newDay = 7;
      newWeek = newWeek > 1 ? newWeek - 1 : 4;
    }

    return [newDay, newWeek];
  };

  const handleNextDay = () => {
    const [newDay, newWeek] = clampDayWeek(day + 1, week);
    setDay(newDay);
    setWeek(newWeek);
    setShowMoodSummary(false);
    setMoodSummary(null);
  };

  const handlePrevDay = () => {
    const [newDay, newWeek] = clampDayWeek(day - 1, week);
    setDay(newDay);
    setWeek(newWeek);
    setShowMoodSummary(false);
    setMoodSummary(null);
  };

  const handleNextWeek = () => {
    const newWeek = week < 4 ? week + 1 : 1;
    setWeek(newWeek);
    setShowMoodSummary(false);
    setMoodSummary(null);
  };

  const handlePrevWeek = () => {
    const newWeek = week > 1 ? week - 1 : 4;
    setWeek(newWeek);
    setShowMoodSummary(false);
    setMoodSummary(null);
  };

  const handleAddActivity = async () => {
    if (!newActivity.trim()) return;

    try {
      setLoading(true);
      setError('');
      const response = await axios.post('/api/activities', {
        name: newActivity.trim(),
        mood: 'Neutral',
        week,
        day
      });

      if (response.data.activity) {
        setActivities([...activities, response.data.activity]);
        setNewActivity('');
        setIsAddingActivity(false);
      }
    } catch (err) {
      console.error('Error adding activity:', err);
      setError('Failed to add activity');
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteActivity = (id) => {
    setShowDeleteModal(true);
    setActivityToDelete(id);
  };

  const handleDeleteActivity = async () => {
    try {
      setLoading(true);
      setError('');
      await axios.delete(`/api/activities/${activityToDelete}`);
      
      setActivities(activities.filter(activity => activity.id !== activityToDelete));
      setShowDeleteModal(false);
      setActivityToDelete(null);
    } catch (err) {
      console.error('Error deleting activity:', err);
      setError('Failed to delete activity');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setActivityToDelete(null);
  };

  const handleToggleCompletion = async (id) => {
    const activity = activities.find(a => a.id === id);
    if (!activity) return;

    try {
      setLoading(true);
      setError('');
      const response = await axios.put(`/api/activities/${id}`, {
        completed: !activity.completed
      });

      if (response.data.activity) {
        setActivities(activities.map(a => 
          a.id === id ? { ...a, completed: !a.completed } : a
        ));
      }
    } catch (err) {
      console.error('Error updating activity completion:', err);
      setError('Failed to update activity');
    } finally {
      setLoading(false);
    }
  };

  const handleSetMood = async (id, mood) => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.put(`/api/activities/${id}`, {
        mood
      });

      if (response.data.activity) {
        setActivities(activities.map(activity =>
          activity.id === id ? { ...activity, mood } : activity
        ));
      }
      
      setShowMoodSelector(false);
      setSelectedActivityId(null);
    } catch (err) {
      console.error('Error updating activity mood:', err);
      setError('Failed to update mood');
    } finally {
      setLoading(false);
    }
  };

  const showMoodOptions = (id) => {
    setSelectedActivityId(id);
    setShowMoodSelector(true);
  };

  const handleEdit = (activity) => {
    setIsEditing(activity.id);
    setEditText(activity.name);
  };

  const handleSaveEdit = async (id) => {
    if (!editText.trim()) return;

    try {
      setLoading(true);
      setError('');
      const response = await axios.put(`/api/activities/${id}`, {
        name: editText.trim()
      });

      if (response.data.activity) {
        setActivities(activities.map(activity =>
          activity.id === id ? { ...activity, name: editText.trim() } : activity
        ));
      }

      setIsEditing(null);
      setEditText('');
    } catch (err) {
      console.error('Error updating activity name:', err);
      setError('Failed to update activity');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditText('');
  };

  // Submit day and show mood summary
  const handleSubmitDay = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.post('/api/activities/submit', {
        week,
        day
      });

      if (response.data.summary) {
        setMoodSummary(response.data.summary);
        setShowMoodSummary(true);
        setDaySubmitted(true);
      }
    } catch (err) {
      console.error('Error submitting day:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
        
        // Show specific error messages
        if (err.response.data.incompleteCount) {
          setError(`Please complete all activities before submitting. ${err.response.data.incompleteCount} of ${err.response.data.totalCount} activities are incomplete.`);
        }
      } else {
        setError('Failed to submit day');
      }
    } finally {
      setLoading(false);
    }
  };

  // Clear functions
  const confirmClearDay = () => {
    setClearType('day');
    setShowClearModal(true);
  };

  const confirmClearAll = () => {
    setClearType('all');
    setShowClearModal(true);
  };

  const handleClearDay = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.post('/api/activities/clear-day', {
        week,
        day
      });

      if (response.data) {
        // Refresh activities list
        setActivities([]);
        setDaySubmitted(false);
        setShowMoodSummary(false);
        setMoodSummary(null);
        
        // Show success message
        const message = `Cleared ${response.data.deletedActivities} activities for Week ${week}, Day ${day}`;
        if (response.data.submissionCleared) {
          setError(`${message} and removed submission.`);
        } else {
          setError(message);
        }
        
        // Clear error after 3 seconds to show as success message
        setTimeout(() => setError(''), 3000);
      }
      
      setShowClearModal(false);
    } catch (err) {
      console.error('Error clearing day:', err);
      setError('Failed to clear day activities');
      setShowClearModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.post('/api/activities/clear-all');

      if (response.data) {
        // Clear current activities
        setActivities([]);
        setDaySubmitted(false);
        setShowMoodSummary(false);
        setMoodSummary(null);
        
        // Show success message
        const message = `Cleared ${response.data.deletedActivities} activities and ${response.data.deletedSubmissions} submissions.`;
        setError(message);
        
        // Clear error after 3 seconds to show as success message
        setTimeout(() => setError(''), 3000);
      }
      
      setShowClearModal(false);
    } catch (err) {
      console.error('Error clearing all:', err);
      setError('Failed to clear all activities');
      setShowClearModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClear = () => {
    setShowClearModal(false);
    setClearType('');
  };

  // Close mood selector when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showMoodSelector) {
        setShowMoodSelector(false);
        setSelectedActivityId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMoodSelector]);

  // Get completion status
  const getCompletionStats = () => {
    const completed = activities.filter(a => a.completed).length;
    const total = activities.length;
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const completionStats = getCompletionStats();

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Mood Summary Modal */}
        {showMoodSummary && moodSummary && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-md">
              <h2 className="text-2xl font-bold mb-6 text-center">Day Summary</h2>
              
              <div className="text-center mb-6">
                <div className="text-lg font-semibold mb-2">Week {moodSummary.week}, Day {moodSummary.day}</div>
                <div className="text-3xl mb-2">
                  {moodSummary.overallMood === 'Calm' && '😌'}
                  {moodSummary.overallMood === 'Neutral' && '😐'}
                  {moodSummary.overallMood === 'Stressed' && '😰'}
                </div>
                <div className="text-xl font-semibold text-gray-700">{moodSummary.overallMood}</div>
                <div className="text-gray-600 mt-2">{moodSummary.overallMessage}</div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <div className="w-4 h-4 bg-green-400 rounded mr-2"></div>
                    Calm
                  </span>
                  <span className="font-semibold">{moodSummary.moodPercentages.calm}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <div className="w-4 h-4 bg-amber-400 rounded mr-2"></div>
                    Neutral
                  </span>
                  <span className="font-semibold">{moodSummary.moodPercentages.neutral}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <div className="w-4 h-4 bg-red-400 rounded mr-2"></div>
                    Stressed
                  </span>
                  <span className="font-semibold">{moodSummary.moodPercentages.stressed}%</span>
                </div>
              </div>

              <div className="text-center text-sm text-gray-600 mb-6">
                Total Activities: {moodSummary.totalActivities}
              </div>

              <div className="flex space-x-3">
                <button 
                  className="flex-1 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                  onClick={() => setShowMoodSummary(false)}
                >
                  Close
                </button>
                <button 
                  className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
                  onClick={() => {
                    setShowMoodSummary(false);
                    handleNextDay();
                  }}
                >
                  Next Day
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Clear Confirmation Modal */}
        {showClearModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md shadow-md w-96">
              <h2 className="text-lg font-semibold mb-4">
                {clearType === 'day' ? 'Clear Current Day?' : 'Clear All Data?'}
              </h2>
              <p className="mb-6 text-gray-600">
                {clearType === 'day' 
                  ? `Are you sure you want to clear all activities and submission for Week ${week}, Day ${day}? This action cannot be undone.`
                  : 'Are you sure you want to clear ALL activities and submissions? This will delete everything and cannot be undone.'
                }
              </p>
              <div className="flex justify-end space-x-4">
                <button 
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50" 
                  onClick={handleCancelClear}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50" 
                  onClick={clearType === 'day' ? handleClearDay : handleClearAll}
                  disabled={loading}
                >
                  {loading ? 'Clearing...' : 'Clear'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-medium">Week {week}</span>
            <button 
              className="p-1 rounded-full hover:bg-gray-300 disabled:opacity-50" 
              onClick={handlePrevWeek}
              disabled={loading}
            >
              ⇦
            </button>
            <button 
              className="p-1 rounded-full hover:bg-gray-300 disabled:opacity-50" 
              onClick={handleNextWeek}
              disabled={loading}
            >
              ⇨
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-lg font-medium">Day {day}</span>
            <button 
              className="p-1 rounded-full hover:bg-gray-300 disabled:opacity-50" 
              onClick={handlePrevDay}
              disabled={loading}
            >
              ⇦
            </button>
            <button 
              className="p-1 rounded-full hover:bg-gray-300 disabled:opacity-50" 
              onClick={handleNextDay}
              disabled={loading}
            >
              ⇨
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              className="px-3 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 text-sm" 
              onClick={confirmClearDay}
              disabled={loading || activities.length === 0}
              title="Clear current day"
            >
              Clear Day
            </button>
            <button 
              className="px-3 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 text-sm" 
              onClick={confirmClearAll}
              disabled={loading}
              title="Clear all data"
            >
              Clear All
            </button>
            <button 
              className="px-4 py-2 rounded-md text-white bg-[#e38b29] hover:brightness-110 disabled:opacity-50" 
              onClick={handleSubmitDay}
              disabled={loading || daySubmitted}
            >
              {daySubmitted ? 'Submitted' : 'Submit Day'}
            </button>
          </div>
        </div>

        {/* Progress indicator */}
        {activities.length > 0 && (
          <div className="bg-white rounded-md p-4 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-600">
                {completionStats.completed}/{completionStats.total} completed ({completionStats.percentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionStats.percentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Add activity form */}
        <div className="bg-white rounded-md p-4 shadow-sm mb-6">
          {isAddingActivity ? (
            <div className="flex items-center justify-between">
              <input
                type="text"
                placeholder="Add activity"
                className="flex-1 p-2 border-none focus:outline-none"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddActivity()}
                autoFocus
                disabled={loading}
              />
              <div className="flex space-x-2">
                <button 
                  className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 disabled:opacity-50" 
                  onClick={() => setIsAddingActivity(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-amber-400 rounded-md text-gray-700 hover:bg-amber-500 disabled:opacity-50" 
                  onClick={handleAddActivity}
                  disabled={loading || !newActivity.trim()}
                >
                  {loading ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>
          ) : (
            <button 
              className="w-full text-left p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50" 
              onClick={() => setIsAddingActivity(true)}
              disabled={loading}
            >
              Add activity
            </button>
          )}
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        )}

        {/* Activity list */}
        <div className="bg-white rounded-md p-4 shadow-sm">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No activities for this day. Add one above!
            </div>
          ) : (
            activities.map(activity => (
              <div key={activity.id} className="mb-4 flex items-center">
                <div className="w-1 h-12 bg-amber-500 mr-4"></div>
                <div className="flex-1">
                  {isEditing === activity.id ? (
                    <input
                      type="text"
                      className="w-full p-1 border rounded focus:outline-none"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(activity.id)}
                      disabled={loading}
                    />
                  ) : (
                    <span className={activity.completed ? 'line-through text-gray-500' : ''}>
                      {activity.name}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      showMoodOptions(activity.id);
                    }}
                    disabled={loading}
                    className={`px-4 py-2 rounded-md mr-4 text-white hover:brightness-110 disabled:opacity-50 ${
                      activity.mood === 'Calm' ? 'bg-green-400' :
                      activity.mood === 'Neutral' ? 'bg-amber-400' :
                      'bg-red-400'
                    }`}
                  >
                    {activity.mood}
                  </button>

                  {showMoodSelector && selectedActivityId === activity.id && (
                    <div className="absolute z-10 mt-1 w-full shadow-md rounded-md bg-white">
                      <button 
                        className="w-full py-2 text-left px-4 hover:bg-green-500 bg-green-400 text-white block disabled:opacity-50" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetMood(activity.id, 'Calm');
                        }}
                        disabled={loading}
                      >
                        Calm
                      </button>
                      <button 
                        className="w-full py-2 text-left px-4 hover:bg-amber-500 bg-amber-400 text-white block disabled:opacity-50" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetMood(activity.id, 'Neutral');
                        }}
                        disabled={loading}
                      >
                        Neutral
                      </button>
                      <button 
                        className="w-full py-2 text-left px-4 hover:bg-red-500 bg-red-400 text-white block disabled:opacity-50" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetMood(activity.id, 'Stressed');
                        }}
                        disabled={loading}
                      >
                        Stressed
                      </button>
                    </div>
                  )}
                </div>

                {isEditing === activity.id ? (
                  <>
                    <button 
                      className="p-2 bg-green-200 rounded-md mr-2 hover:bg-green-300 disabled:opacity-50" 
                      onClick={() => handleSaveEdit(activity.id)}
                      disabled={loading || !editText.trim()}
                    >
                      ✔
                    </button>
                    <button 
                      className="p-2 bg-gray-200 rounded-md mr-2 hover:bg-gray-300 disabled:opacity-50" 
                      onClick={handleCancelEdit}
                      disabled={loading}
                    >
                      ✖
                    </button>
                  </>
                ) : (
                  <button 
                    className="p-2 bg-gray-200 rounded-md mr-2 hover:bg-gray-300 disabled:opacity-50" 
                    onClick={() => handleEdit(activity)}
                    disabled={loading}
                  >
                    ✎
                  </button>
                )}

                <button 
                  className="p-2 bg-red-200 rounded-md mr-2 hover:bg-red-300 disabled:opacity-50" 
                  onClick={() => confirmDeleteActivity(activity.id)}
                  disabled={loading}
                >
                  🗑
                </button>

                <button
                  className={`px-4 py-2 rounded-md hover:brightness-110 disabled:opacity-50 ${
                    activity.completed ? 'bg-green-400 text-white' : 'bg-red-400 text-white'
                  }`}
                  onClick={() => handleToggleCompletion(activity.id)}
                  disabled={loading}
                >
                  {activity.completed ? 'Done' : 'Not Done'}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Delete confirmation modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md shadow-md w-96">
              <h2 className="text-lg font-semibold mb-4">Delete Activity?</h2>
              <p className="mb-6">Are you sure you want to delete this activity?</p>
              <div className="flex justify-end space-x-4">
                <button 
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50" 
                  onClick={handleCancelDelete}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 disabled:opacity-50" 
                  onClick={handleDeleteActivity}
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;