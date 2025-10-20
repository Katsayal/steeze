import { useEffect, useState } from 'react';
import axios from '../services/api';
import { FaTrash, FaEdit } from 'react-icons/fa';

function Wardrobe() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [editType, setEditType] = useState('');
  const [editTags, setEditTags] = useState('');

  const fetchWardrobe = async () => {
    try {
      const res = await axios.get('/user/wardrobe');
      setItems(res.data);
    } catch (err) {
      console.error('Failed to fetch wardrobe:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await axios.delete(`/user/wardrobe/${id}`);
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      console.error('Failed to delete item:', err);
      alert('Failed to delete');
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setEditType(item.type);
    setEditTags(item.styleTags.join(', '));
  };

  const handleEditSave = async () => {
    try {
      const updated = {
        type: editType,
        styleTags: editTags.split(',').map(tag => tag.trim()).filter(Boolean),
      };
      
      await axios.put(`/user/wardrobe/${editingItem._id}`, updated);
      
      setItems(items.map(i =>
        i._id === editingItem._id ? { ...i, ...updated } : i
      ));
      
      setEditingItem(null);
    } catch (err) {
      console.error('Update failed', err);
      alert('Failed to update item');
    }
  };

  useEffect(() => {
    fetchWardrobe();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Wardrobe</h2>

      {loading ? (
        <p>Loading wardrobe...</p>
      ) : items.length === 0 ? (
        <p>No items found. Go to <a href="/upload" className="text-blue-600 underline">Upload</a> to add clothing.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item._id} className="relative bg-white rounded shadow p-3 border">
              <img
                src={item.imageUrl}
                alt={item.type}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <p className="font-semibold capitalize">{item.type}</p>
              <div className="text-sm text-gray-600 mb-2">
                {item.styleTags?.map(tag => (
                  <span
                    key={tag}
                    className="inline-block bg-gray-200 rounded px-2 py-0.5 text-xs mr-1 mt-1"
                  >
                    {tag}
                    </span>
                  ))}
                </div>
                
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => handleEditClick(item)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                </div>
              </div>
              ))}
          </div>
        )}
        
        {editingItem && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded w-full max-w-md space-y-4">
      <h3 className="text-lg font-semibold">Edit Wardrobe Item</h3>

      <div>
        <label className="block text-sm font-medium">Type</label>
        <select
          className="w-full border rounded p-2 mt-1"
          value={editType}
          onChange={(e) => setEditType(e.target.value)}
        >
          <option value="shirt">Shirt</option>
          <option value="pants">Pants</option>
          <option value="jacket">Jacket</option>
          <option value="shoes">Shoes</option>
          <option value="accessory">Accessory</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Tags</label>
        <input
          type="text"
          className="w-full border rounded p-2 mt-1"
          value={editTags}
          onChange={(e) => setEditTags(e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-1">Comma-separated (e.g., casual, sporty)</p>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setEditingItem(null)}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleEditSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default Wardrobe;