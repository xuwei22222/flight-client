import { useModal } from '../context/ModalContext';
import { useState } from 'react';
import { api } from '../services/AxiosApi';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const LoginModal = () => {
  const { loginModalOpen, closeLoginModal, handleLoginSuccess } = useModal();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token, response.data.user);
      handleLoginSuccess();
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.');
    }
  };

  if (!loginModalOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-invert backdrop-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6 border-b">
          <h3 className="text-lg font-medium text-gray-900">Login</h3>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-left text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-left text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex justify-between items-center rounded-b-lg">
          <Link to="/register" className="text-sm text-blue-600 hover:text-blue-700" onClick={closeLoginModal}>
            Don't have an account? Sign Up
          </Link>
          <div className="flex space-x-3">
            <button onClick={closeLoginModal} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;