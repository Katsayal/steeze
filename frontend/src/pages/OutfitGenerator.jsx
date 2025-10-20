import { useState, useEffect } from 'react';
import axios from '../services/api';

function OutfitGenerator() {
  const [styleTags, setStyleTags] = useState('');
  const [mood, setMood] = useState('');
  const [outfit, setOutfit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState({ lat: null, lon: null });
  const [locationError, setLocationError] = useState('');
  const [weatherInfo, setWeatherInfo] = useState(null);

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLocationError('');
      },
      () => {
        setLocationError('Unable to retrieve your location');
      }
    );
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/outfit/generate', {
        styleTags: styleTags.split(',').map(t => t.trim()).filter(Boolean),
        mood,
        lat: coords.lat,
        lon: coords.lon,
      });

      setOutfit(res.data.outfit);
      setWeatherInfo(res.data.weatherInfo);
    } catch (err) {
      console.error('Failed to generate outfit:', err);
      alert(err.response?.data?.error || 'Failed to generate outfit');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Outfit Generator</h2>

      {/* Weather & Location Info */}
      {weatherInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {weatherInfo.condition.includes('rain') ? '🌧️' : 
               weatherInfo.condition.includes('cloud') ? '☁️' : 
               weatherInfo.condition.includes('clear') ? '☀️' : '🌤️'}
            </span>
            <div>
              <p className="font-semibold">Current Weather</p>
              <p className="text-sm text-gray-600">
                {weatherInfo.temperature}°C - {weatherInfo.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {locationError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-sm text-yellow-800">
          {locationError} - Outfit will be generated without weather data
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium">Style Tags</label>
          <input
            type="text"
            className="input"
            placeholder="e.g., casual, streetwear"
            value={styleTags}
            onChange={e => setStyleTags(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Mood</label>
          <select
            className="input"
            value={mood}
            onChange={e => setMood(e.target.value)}
          >
            <option value="">Select mood</option>
            <option value="confident">Confident</option>
            <option value="chill">Chill</option>
            <option value="creative">Creative</option>
            <option value="sporty">Sporty</option>
          </select>
        </div>

      </div>

      <button
        onClick={handleGenerate}
        className="btn bg-purple-600 hover:bg-purple-700 text-white"
        disabled={loading}
      >
        {loading ? 'Generating...' : '✨ Generate Outfit based on Weather'}
      </button>

      <div className="mt-8">
        {outfit && outfit.items && outfit.items.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Your Outfit</h3>
              {outfit.mood && (
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                  {outfit.mood}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {outfit.items.map(item => (
                <div key={item._id} className="bg-white border rounded p-3 hover:shadow-md transition-shadow">
                  <img
                    src={item.imageUrl}
                    alt={item.type}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <p className="capitalize font-semibold text-sm">{item.type}</p>
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

            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <p className="text-green-700 font-medium">✅ Outfit saved to your collection!</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default OutfitGenerator;
