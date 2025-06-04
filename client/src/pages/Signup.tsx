import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Briefcase, Loader } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';


const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'client' | 'freelancer'>('client');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // await signup(name, email, password, role);

      await axios.post('https://jobistry-api.onrender.com/api/auth/register', {
        'name': name,
        'email': email,
        'password': password,
        'role': role
      }, { withCredentials: true })
        .then((res) => {
          console.log("Signupform =>", res);
          if (res.status < 300) {
            setUser(res.data.user);
            setIsAuthenticated(true);
            navigate('/dashboard');
          }
        })
        .catch((err) => {
          console.log(err);
        })
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-secondary-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="w-full max-w-md mx-auto my-auto p-6"
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <div className="card">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
            <p className="text-gray-600 mt-2">Join Jobistry today</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="label">
                Full name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input pl-10"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div>
              <label className="label">I want to</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className={`py-3 px-4 rounded-md border ${role === 'client'
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    } transition-colors`}
                  onClick={() => setRole('client')}
                >
                  <Briefcase size={20} className="mx-auto mb-2" />
                  <span className="block text-sm font-medium">Hire talent</span>
                </button>
                <button
                  type="button"
                  className={`py-3 px-4 rounded-md border ${role === 'freelancer'
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    } transition-colors`}
                  onClick={() => setRole('freelancer')}
                >
                  <User size={20} className="mx-auto mb-2" />
                  <span className="block text-sm font-medium">Work as freelancer</span>
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader size={20} className="animate-spin mr-2" />
                    Creating account...
                  </span>
                ) : (
                  'Create account'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};


export default Signup;