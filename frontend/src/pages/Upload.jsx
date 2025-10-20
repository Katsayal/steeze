import { useState } from 'react';
import axios from '../services/api';

function Upload() {
  const [type, setType] = useState('');
  const [styleTags, setStyleTags] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !type) {
      return alert('Image and type are required.');
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('type', type);
    formData.append('styleTags', styleTags);

    try {
      setStatus('Uploading...');
      await axios.post('/user/wardrobe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setStatus('✅ Upload successful');
      setType('');
      setStyleTags('');
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error('Upload error:', err);
      const errorMsg = err.response?.data?.error || err.response?.data?.details || 'Upload failed';
      setStatus(`❌ ${errorMsg}`);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Upload Wardrobe Item</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Clothing Type</label>
          <select
            className="mt-1 block w-full border rounded p-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">Select type</option>
            <option value="shirt">Shirt</option>
            <option value="pants">Pants</option>
            <option value="jacket">Jacket</option>
            <option value="shoes">Shoes</option>
            <option value="accessory">Accessory</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Style Tags (comma-separated)</label>
          <input
            type="text"
            className="mt-1 block w-full border rounded p-2"
            placeholder="streetwear, casual"
            value={styleTags}
            onChange={(e) => setStyleTags(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            className="w-full bg-red-300 text-black py-2 rounded hover:bg-red-700"
            onChange={handleImageChange}
            required
          />
        </div>

        {preview && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-1">Preview:</p>
            <img src={preview} alt="preview" className="w-48 rounded border" />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Upload Item
        </button>

        {status && <p className="mt-2 text-sm text-center">{status}</p>}
      </form>
    </div>
  );
}

export default Upload;

