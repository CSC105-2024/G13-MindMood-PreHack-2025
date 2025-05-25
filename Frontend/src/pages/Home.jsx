import React, { useState } from 'react';
import Navbar from '../components/UI/Navbar';

const Home = () => {
  const [week, setWeek] = useState(1);
  const [day, setDay] = useState(1);
  const [activities, setActivities] = useState({});
  const [newActivity, setNewActivity] = useState('');
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [editText, setEditText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [showMoodSummary, setShowMoodSummary] = useState(false);

  const key = `week-${week}-day-${day}`;

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
  };

  const handlePrevDay = () => {
    const [newDay, newWeek] = clampDayWeek(day - 1, week);
    setDay(newDay);
    setWeek(newWeek);
  };

  const handleNextWeek = () => {
    const newWeek = week < 4 ? week + 1 : 1;
    setWeek(newWeek);
  };

  const handlePrevWeek = () => {
    const newWeek = week > 1 ? week - 1 : 4;
    setWeek(newWeek);
  };

  const handleAddActivity = () => {
    if (newActivity.trim()) {
      const current = activities[key] || [];
      const newId = current.length > 0 ? Math.max(...current.map(a => a.id)) + 1 : 1;
      const updated = [...current, { id: newId, name: newActivity, mood: 'Neutral', completed: false }];
      setActivities({ ...activities, [key]: updated });
      setNewActivity('');
      setIsAddingActivity(false);
    }
  };

  const confirmDeleteActivity = (id) => {
    setShowDeleteModal(true);
    setActivityToDelete(id);
  };

  const handleDeleteActivity = () => {
    const updated = (activities[key] || []).filter(activity => activity.id !== activityToDelete);
    setActivities({ ...activities, [key]: updated });
    setShowDeleteModal(false);
    setActivityToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setActivityToDelete(null);
  };

  const handleToggleCompletion = (id) => {
    const updated = (activities[key] || []).map(activity =>
      activity.id === id ? { ...activity, completed: !activity.completed } : activity
    );
    setActivities({ ...activities, [key]: updated });
  };

  const handleSetMood = (id, mood) => {
    const updated = (activities[key] || []).map(activity =>
      activity.id === id ? { ...activity, mood } : activity
    );
    setActivities({ ...activities, [key]: updated });
    setShowMoodSelector(false);
  };

  const showMoodOptions = (id) => {
    setSelectedActivityId(id);
    setShowMoodSelector(true);
  };

  const handleEdit = (activity) => {
    setIsEditing(activity.id);
    setEditText(activity.name);
  };

  const handleSaveEdit = (id) => {
    const updated = (activities[key] || []).map(activity =>
      activity.id === id ? { ...activity, name: editText } : activity
    );
    setActivities({ ...activities, [key]: updated });
    setIsEditing(null);
    setEditText('');
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditText('');
  };

  const handleSubmit = () => {
    setShowMoodSummary(true);
  };

  const calculateMoodSummary = () => {
    const moodCounts = { Calm: 0, Neutral: 0, Stressed: 0 };
    const list = activities[key] || [];

    list.forEach(activity => {
      if (activity.mood in moodCounts) {
        moodCounts[activity.mood]++;
      }
    });

    const total = list.length || 1;
    const Calm = Math.round((moodCounts.Calm / total) * 100);
    const Neutral = Math.round((moodCounts.Neutral / total) * 100);
    const Stressed = Math.round((moodCounts.Stressed / total) * 100);

    const maxMood = Math.max(Calm, Neutral, Stressed);
    let overallMood = 'Neutral';
    if (Calm === maxMood) overallMood = 'You are having a good feeling today';
    else if (Neutral === maxMood) overallMood = 'You feel neutral today';
    else overallMood = 'You might be feeling stressed';

    return { Calm, Neutral, Stressed, overallMood };
  };

  const { Calm, Neutral, Stressed, overallMood } = calculateMoodSummary();

  const getMoodColor = () => {
    const max = Math.max(Calm, Neutral, Stressed);
    if (Calm === max) return 'bg-green-500';
    if (Neutral === max) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getMoodEmoji = () => {
    const max = Math.max(Calm, Neutral, Stressed);
    if (Calm === max) return '😊';
    if (Neutral === max) return '😐';
    return '😣';
  };

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-medium">Week {week}</span>
            <button className="p-1 rounded-full hover:bg-gray-300" onClick={handlePrevWeek}>⇦</button>
            <button className="p-1 rounded-full hover:bg-gray-300" onClick={handleNextWeek}>⇨</button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-medium">Day {day}</span>
            <button className="p-1 rounded-full hover:bg-gray-300" onClick={handlePrevDay}>⇦</button>
            <button className="p-1 rounded-full hover:bg-gray-300" onClick={handleNextDay}>⇨</button>
          </div>
          <button className="px-4 py-2 rounded-md text-white bg-[#e38b29] hover:brightness-110" onClick={handleSubmit}>
            Submit
          </button>
        </div>

        {/* Add Activity */}
        <div className="bg-white rounded-md p-4 shadow-sm mb-6">
          {isAddingActivity ? (
            <div className="flex items-center justify-between">
              <input
                type="text"
                placeholder="Add activity"
                className="flex-1 p-2 border-none focus:outline-none"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                autoFocus
              />
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300" onClick={() => setIsAddingActivity(false)}>Cancel</button>
                <button className="px-4 py-2 bg-amber-400 rounded-md text-gray-700 hover:bg-amber-500" onClick={handleAddActivity}>Add</button>
              </div>
            </div>
          ) : (
            <button className="w-full text-left p-2 text-gray-600 hover:bg-gray-100" onClick={() => setIsAddingActivity(true)}>Add activity</button>
          )}
        </div>

        {/* Activity List */}
        <div className="bg-white rounded-md p-4 shadow-sm">
          {(activities[key] || []).map(activity => (
            <div key={activity.id} className="mb-4 flex items-center">
              <div className="w-1 h-12 bg-amber-500 mr-4"></div>
              <div className="mr-2">{activity.id}</div>
              <div className="flex-1">
                {isEditing === activity.id ? (
                  <input
                    type="text"
                    className="w-full p-1 border rounded focus:outline-none"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                ) : (
                  <span>{activity.name}</span>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => showMoodOptions(activity.id)}
                  className={`px-4 py-2 rounded-md mr-4 text-white hover:brightness-110 ${
                    activity.mood === 'Calm' ? 'bg-green-400' :
                    activity.mood === 'Neutral' ? 'bg-amber-400' :
                    'bg-red-400'
                  }`}
                >
                  {activity.mood}
                </button>
                {showMoodSelector && selectedActivityId === activity.id && (
                  <div className="absolute z-10 mt-1 w-full shadow-md rounded-md bg-white">
                    <button className="w-full py-2 text-left px-4 hover:bg-green-500 bg-green-400 text-white block" onClick={() => handleSetMood(activity.id, 'Calm')}>Calm</button>
                    <button className="w-full py-2 text-left px-4 hover:bg-amber-500 bg-amber-400 text-white block" onClick={() => handleSetMood(activity.id, 'Neutral')}>Neutral</button>
                    <button className="w-full py-2 text-left px-4 hover:bg-red-500 bg-red-400 text-white block" onClick={() => handleSetMood(activity.id, 'Stressed')}>Stressed</button>
                  </div>
                )}
              </div>

              {isEditing === activity.id ? (
                <>
                  <button className="p-2 bg-green-200 rounded-md mr-2 hover:bg-green-300" onClick={() => handleSaveEdit(activity.id)}>✔</button>
                  <button className="p-2 bg-gray-200 rounded-md mr-2 hover:bg-gray-300" onClick={handleCancelEdit}>✖</button>
                </>
              ) : (
                <button className="p-2 bg-gray-200 rounded-md mr-2 hover:bg-gray-300" onClick={() => handleEdit(activity)}>✎</button>
              )}

              <button className="p-2 bg-red-200 rounded-md mr-2 hover:bg-red-300" onClick={() => confirmDeleteActivity(activity.id)}>🗑</button>

              <button
                className={`px-4 py-2 rounded-md hover:brightness-110 ${activity.completed ? 'bg-green-400 text-white' : 'bg-red-400 text-white'}`}
                onClick={() => handleToggleCompletion(activity.id)}
              >
                {activity.completed ? 'Done' : 'Not Done'}
              </button>
            </div>
          ))}
        </div>

        {/* Mood Summary Modal */}
        {showMoodSummary && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className={`text-white p-8 rounded-md text-center shadow-md w-[320px] ${getMoodColor()}`}>
              <div className="text-5xl mb-4">
                {getMoodEmoji()}
              </div>
              <h2 className="text-xl font-semibold mb-2">Day {day}</h2>
              <p className="mb-4">Overall: {overallMood}</p>
              <div className="text-sm mb-4 space-y-1">
                <p>Calm : {Calm}%</p>
                <p>Neutral : {Neutral}%</p>
                <p>Stressed : {Stressed}%</p>
              </div>
              <button
                className="bg-black text-white px-4 py-2 rounded-md hover:brightness-110"
                onClick={() => {
                  setShowMoodSummary(false);
                  handleNextDay();
                }}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md shadow-md w-96">
              <h2 className="text-lg font-semibold mb-4">Delete Activity?</h2>
              <p className="mb-6">Are you sure you want to delete your activity?</p>
              <div className="flex justify-end space-x-4">
                <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300" onClick={handleCancelDelete}>Cancel</button>
                <button className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600" onClick={handleDeleteActivity}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
