import { useState } from 'react';
import { Link } from "react-router-dom";
import Navbar from '../components/UI/Navbar';

const MoodTracker = () => {
  const [week, setWeek] = useState(1);
  const [day, setDay] = useState(1);
  const [activities, setActivities] = useState([

  ]);
  const [newActivity, setNewActivity] = useState('');
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);

  const handleAddActivity = () => {
    if (newActivity.trim() !== '') {
      const newId = activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1;
      setActivities([...activities, { 
        id: newId, 
        name: newActivity, 
        mood: 'Neutral', 
        completed: false 
      }]);
      setNewActivity('');
      setIsAddingActivity(false);
    }
  };

  const handleDeleteActivity = (id) => {
    setActivities(activities.filter(activity => activity.id !== id));
  };

  const handleToggleCompletion = (id) => {
    setActivities(activities.map(activity => 
      activity.id === id ? { ...activity, completed: !activity.completed } : activity
    ));
  };

  const handleSetMood = (id, mood) => {
    setActivities(activities.map(activity => 
      activity.id === id ? { ...activity, mood } : activity
    ));
    setShowMoodSelector(false);
  };

  const showMoodOptions = (id) => {
    setSelectedActivityId(id);
    setShowMoodSelector(true);
  };

  return (
    <div className="min-h-screen bg-amber-50">
        <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-medium">Week {week}</span>
            <button className="p-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-lg font-medium">Day {day}</span>
            <button className="p-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <button className="px-4 py-2 bg-amber-400 rounded-md text-gray-700">Submit</button>
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
              />
              <div className="flex space-x-2">
                <button 
                  className="px-4 py-2 bg-gray-200 rounded-md text-gray-700"
                  onClick={() => setIsAddingActivity(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-amber-400 rounded-md text-gray-700"
                  onClick={handleAddActivity}
                >
                  Add
                </button>
              </div>
            </div>
          ) : (
            <button 
              className="w-full text-left p-2 text-gray-600"
              onClick={() => setIsAddingActivity(true)}
            >
              Add activity
            </button>
          )}
        </div>

        <div className="bg-white rounded-md p-4 shadow-sm">
          {activities.map(activity => (
            <div key={activity.id} className="mb-4 flex items-center">
              <div className="w-1 h-12 bg-amber-500 mr-4"></div>
              <div className="mr-2">{activity.id}</div>
              <div className="flex-1">{activity.name}</div>
              
              <div className="relative">
                <button 
                  onClick={() => showMoodOptions(activity.id)}
                  className={`px-4 py-2 rounded-md mr-4 text-white ${
                    activity.mood === 'Calm' ? 'bg-green-400' : 
                    activity.mood === 'Neutral' ? 'bg-amber-400' : 
                    'bg-red-400'
                  }`}
                >
                  {activity.mood}
                </button>
                
                {showMoodSelector && selectedActivityId === activity.id && (
                  <div className="absolute z-10 mt-1 w-full">
                    <button 
                      className="w-full py-2 bg-green-400 text-white block"
                      onClick={() => handleSetMood(activity.id, 'Calm')}
                    >
                      Calm
                    </button>
                    <button 
                      className="w-full py-2 bg-amber-400 text-white block"
                      onClick={() => handleSetMood(activity.id, 'Neutral')}
                    >
                      Neutral
                    </button>
                    <button 
                      className="w-full py-2 bg-red-400 text-white block"
                      onClick={() => handleSetMood(activity.id, 'Stressed')}
                    >
                      Stressed
                    </button>
                  </div>
                )}
              </div>
              
              <button className="p-2 bg-gray-200 rounded-md mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" />
                </svg>
              </button>
              
              <button 
                className="p-2 bg-red-200 rounded-md mr-2"
                onClick={() => handleDeleteActivity(activity.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              
              <button 
                className={`px-4 py-2 rounded-md ${activity.completed ? 'bg-green-400 text-white' : 'bg-red-400 text-white'}`}
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

export default MoodTracker;