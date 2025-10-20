import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="bg-white shadow mb-6">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold text-purple-600">Steeze</Link>

        {isAuthenticated && (
          <div className="flex gap-4 items-center">
            <Link to="/dashboard" className="hover:text-purple-600">Dashboard</Link>
            <Link to="/wardrobe" className="hover:text-purple-600">Wardrobe</Link>
            <Link to="/upload" className="hover:text-purple-600">Upload</Link>
            <Link to="/outfit/generate" className="hover:text-purple-600">Generate</Link>
            <Link to="/outfit/saved" className="hover:text-purple-600">Saved</Link>
            <Link to="/profile" className="hover:text-purple-600">Profile</Link>
            <button onClick={logout} className="text-red-500 hover:text-red-700">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;