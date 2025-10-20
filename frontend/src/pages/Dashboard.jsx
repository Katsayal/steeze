import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../services/api';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    wardrobeCount: 0,
    outfitCount: 0,
    recentItems: []
  });
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [wardrobeRes, outfitsRes] = await Promise.all([
          axios.get('/user/wardrobe?limit=6'),
          axios.get('/outfit')
        ]);

        setStats({
          wardrobeCount: wardrobeRes.data.length,
          outfitCount: outfitsRes.data.length,
          recentItems: wardrobeRes.data.slice(0, 6)
        });
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchWeather = async (lat, lon) => {
      try {
        const res = await axios.get('/weather', {
          params: { lat, lon }
        });
        
        setWeather(res.data);
      } catch (err) {
        console.error('Failed to fetch weather:', err);
      } finally {
        setWeatherLoading(false);
      }
    };

    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchWeather(position.coords.latitude, position.coords.longitude);
          },
          () => {
            setWeatherLoading(false);
          }
        );
      } else {
        setWeatherLoading(false);
      }
    };

    fetchDashboardData();
    getUserLocation();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to Steeze! 👋</h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>
          
          {/* Weather Widget */}
          {!weatherLoading && weather && (
            <div className="bg-gradient-to-br from-sky-400 to-blue-500 text-white rounded-lg shadow-lg p-4 min-w-[200px]">
              <div className="flex items-center gap-3">
                <div className="text-5xl">
                  {weather.condition.includes('rain') ? '🌧️' : 
                   weather.condition.includes('cloud') ? '☁️' : 
                   weather.condition.includes('clear') ? '☀️' : 
                   weather.condition.includes('snow') ? '❄️' : '🌤️'}
                </div>
                <div>
                  <p className="text-3xl font-bold">{Math.round(weather.temperature)}°C</p>
                  <p className="text-sm text-blue-100 capitalize">{weather.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Wardrobe Items</p>
              <p className="text-4xl font-bold mt-2">{stats.wardrobeCount}</p>
            </div>
            <div className="text-5xl opacity-20">👕</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Saved Outfits</p>
              <p className="text-4xl font-bold mt-2">{stats.outfitCount}</p>
            </div>
            <div className="text-5xl opacity-20">✨</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Style Score</p>
              <p className="text-4xl font-bold mt-2">
                {stats.wardrobeCount > 0 ? Math.min(100, stats.wardrobeCount * 10) : 0}
              </p>
            </div>
            <div className="text-5xl opacity-20">🔥</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/upload"
            className="bg-white border-2 border-purple-200 hover:border-purple-400 rounded-lg p-6 text-center transition-all hover:shadow-md"
          >
            <div className="text-4xl mb-2">📸</div>
            <p className="font-semibold">Upload Item</p>
            <p className="text-sm text-gray-500">Add to wardrobe</p>
          </Link>

          <Link
            to="/outfit/generate"
            className="bg-white border-2 border-blue-200 hover:border-blue-400 rounded-lg p-6 text-center transition-all hover:shadow-md"
          >
            <div className="text-4xl mb-2">✨</div>
            <p className="font-semibold">Generate Outfit</p>
            <p className="text-sm text-gray-500">Get recommendations</p>
          </Link>

          <Link
            to="/wardrobe"
            className="bg-white border-2 border-green-200 hover:border-green-400 rounded-lg p-6 text-center transition-all hover:shadow-md"
          >
            <div className="text-4xl mb-2">👔</div>
            <p className="font-semibold">View Wardrobe</p>
            <p className="text-sm text-gray-500">Browse your items</p>
          </Link>

          <Link
            to="/outfit/saved"
            className="bg-white border-2 border-pink-200 hover:border-pink-400 rounded-lg p-6 text-center transition-all hover:shadow-md"
          >
            <div className="text-4xl mb-2">💾</div>
            <p className="font-semibold">Saved Outfits</p>
            <p className="text-sm text-gray-500">View collections</p>
          </Link>
        </div>
      </div>

      {/* Recent Items */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Recent Wardrobe Items</h2>
          <Link to="/wardrobe" className="text-purple-600 hover:text-purple-700 font-medium">
            View All →
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : stats.recentItems.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">👕</div>
            <p className="text-gray-600 mb-4">Your wardrobe is empty</p>
            <Link
              to="/upload"
              className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              Upload Your First Item
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {stats.recentItems.map(item => (
              <div key={item._id} className="bg-white border rounded-lg p-3 hover:shadow-md transition-shadow">
                <img
                  src={item.imageUrl}
                  alt={item.type}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <p className="font-semibold capitalize text-sm truncate">{item.type}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.styleTags?.slice(0, 2).map(tag => (
                    <span
                      key={tag}
                      className="inline-block bg-gray-200 rounded px-1.5 py-0.5 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
