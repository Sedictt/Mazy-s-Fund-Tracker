import React, { useState } from 'react';
import Card from './common/Card';
import { validateMemberCredentials, isAdminCredentials } from '../memberCredentials';

interface LoginPageProps {
  onLogin: (username: string, role: 'admin' | 'member') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(async () => {
      // Check admin login
      if (isAdminCredentials(username, password)) {
        if (stayLoggedIn) {
          localStorage.setItem('fundTracker_user', 'Mazy');
          localStorage.setItem('fundTracker_role', 'admin');
        }
        onLogin('Mazy', 'admin');
        setIsLoading(false);
        return;
      }

      // Check member login
      try {
        const member = await validateMemberCredentials(username, password);
        if (member) {
          if (stayLoggedIn) {
            localStorage.setItem('fundTracker_user', member.name);
            localStorage.setItem('fundTracker_role', 'member');
          }
          onLogin(member.name, 'member');
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.error("Login error:", err);
      }

      // Invalid credentials
      setError('Invalid username or password');
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-violet-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-6 sm:p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="Mazy Fund Tracker" className="h-16 sm:h-20 w-auto" />
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-center text-gray-600 mb-6 sm:mb-8">
            Sign in to access your fund tracker
          </p>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex items-center mb-4">
              <input
                id="stayLoggedIn"
                type="checkbox"
                checked={stayLoggedIn}
                onChange={(e) => setStayLoggedIn(e.target.checked)}
                className="w-4 h-4 text-violet-600 bg-gray-100 border-gray-300 rounded focus:ring-violet-500 focus:ring-2"
              />
              <label htmlFor="stayLoggedIn" className="ml-2 text-sm text-gray-700 cursor-pointer">
                Stay logged in
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-violet-500 text-white rounded-lg font-semibold hover:bg-violet-600 transition-colors disabled:bg-violet-300 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
