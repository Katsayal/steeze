import { createContext, useState, useEffect, useContext } from 'react';
import axios from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null); // holds user data
  const [token, setToken] = useState(localStorage.getItem('steeze_token') || null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    if (token) {
      axios.get('/user/profile')
        .then(res => setUser(res.data))
        .catch(() => {
          setToken(null);
          setUser(null);
          localStorage.removeItem('steeze_token');
        })
        .finally(() => setLoading(false)); // Set loading to false after fetch
    } else {
      setLoading(false); // No token, not loading
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true); // Set loading to true before fetch
    const res = await axios.post('/auth/login', { email, password });
    const { token } = res.data;

    localStorage.setItem('steeze_token', token);
    setToken(token);

    const profile = await axios.get('/user/profile');
    setUser(profile.data);

    navigate('/dashboard');
  };

  const signup = async (email, password) => {
    await axios.post('/auth/signup', { email, password });
    await login(email, password);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('steeze_token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);