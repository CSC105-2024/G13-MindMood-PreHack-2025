import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

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

  const key = `week-${week}-day-${day}`;

  useEffect(() => {
    if (day > 7) {
      setDay(1);
      setWeek(prev => prev < 4 ? prev + 1 : 1);
    }
    if (day < 1) {
      setDay(7);
      setWeek(prev => prev > 1 ? prev - 1 : 4);
    }
  }, [day]);

  useEffect(() => {
    if (week > 4) setWeek(1);
    if (week < 1) setWeek(4);
  }, [week]);

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

  const handleDeleteActivity = (id) => {
    const updated = (activities[key] || []).filter(activity => activity.id !== id);
    setActivities({ ...activities, [key]: updated });
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

  const goToPreviousDay = () => setDay(prev => prev - 1);
  const goToNextDay = () => setDay(prev => prev + 1);
  const goToPreviousWeek = () => setWeek(prev => prev - 1);
  const goToNextWeek = () => setWeek(prev => prev + 1);

  const handleSubmit = () => {
    setDay(prevDay => prevDay + 1);
  };

  return (
    <div className="min-h-screen bg-amber-50">
      <main className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-medium">Week {week}</span>
            <button className="p-1 rounded-full hover:bg-gray-300" onClick={goToPreviousWeek}>⇦</button>
            <button className="p-1 rounded-full hover:bg-gray-300" onClick={goToNextWeek}>⇨</button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-lg font-medium">Day {day}</span>
            <button className="p-1 rounded-full hover:bg-gray-300" onClick={goToPreviousDay}>⇦</button>
            <button className="p-1 rounded-full hover:bg-gray-300" onClick={goToNextDay}>⇨</button>
          </div>

          <button
            className="px-4 py-2 rounded-md text-white bg-[#e38b29] hover:brightness-110"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>

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

              <button className="p-2 bg-red-200 rounded-md mr-2 hover:bg-red-300" onClick={() => handleDeleteActivity(activity.id)}>🗑</button>

              <button
                className={`px-4 py-2 rounded-md hover:brightness-110 ${activity.completed ? 'bg-green-400 text-white' : 'bg-red-400 text-white'}`}
                onClick={() => handleToggleCompletion(activity.id)}
              >
                {activity.completed ? 'Done' : 'Not Done'}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
