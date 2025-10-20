import { useEffect, useState } from 'react';
import axios from '../services/api';
import { FaTrash } from 'react-icons/fa';

function SavedOutfits() {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOutfits = async () => {
    try {
      const res = await axios.get('/outfit');
      setOutfits(res.data);
    } catch (err) {
      console.error('Failed to fetch outfits:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this outfit?')) return;

    try {
      await axios.delete(`/outfit/${id}`);
      setOutfits(outfits.filter(outfit => outfit._id !== id));
    } catch (err) {
      console.error('Failed to delete outfit:', err);
      alert('Failed to delete outfit');
    }
  };

  useEffect(() => {
    fetchOutfits();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Saved Outfits</h2>

      {loading ? (
        <p className="text-gray-500">Loading outfits...</p>
      ) : outfits.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">✨</div>
          <p className="text-gray-600 mb-4">No saved outfits yet</p>
          <a
            href="/outfit/generate"
            className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Generate Your First Outfit
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {outfits.map(outfit => (
            <div key={outfit._id} className="bg-white border rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Outfit {new Date(outfit.createdAt).toLocaleDateString()}
                  </h3>
                  <div className="flex gap-2 mt-2 text-sm text-gray-600">
                    {outfit.mood && (
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                        Mood: {outfit.mood}
                      </span>
                    )}
                    {outfit.weather && (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                        Weather: {outfit.weather}
                      </span>
                    )}
                  </div>
                  {outfit.tags && outfit.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {outfit.tags.map(tag => (
                        <span
                          key={tag}
                          className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(outfit._id)}
                  className="text-red-500 hover:text-red-700 p-2"
                  title="Delete outfit"
                >
                  <FaTrash size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {outfit.items?.map(item => (
                  <div key={item._id} className="bg-gray-50 border rounded p-3">
                    <img
                      src={item.imageUrl}
                      alt={item.type}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                    <p className="font-semibold capitalize text-sm">{item.type}</p>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedOutfits;
