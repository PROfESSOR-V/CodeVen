import { useState } from 'react';
import { GraduationCap, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SignupForm } from './SignupForm';

export function BaseLoginForm({ role, additionalFields = [], disableSignup = false }) {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [formType, setFormType] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setIsLoading(true);
      console.log('Attempting login...', { email: formData.email, role });
      
      // Use Firebase authentication with role validation
      await login(formData.email, formData.password, role);
      
      // Store additional profile data if available
      if (formData) {
        localStorage.setItem(`${role}Profile`, JSON.stringify({
          email: formData.email,
          role: role,
          ...additionalFields.reduce((acc, field) => ({
            ...acc,
            [field.name]: formData[field.name] || ''
          }), {})
        }));
      }

      console.log('Login successful, navigating to dashboard...');
      // Navigate to the appropriate dashboard
      if (role === 'student') {
        navigate('/student/dashboard');
      } else if (role === 'faculty') {
        navigate('/faculty/dashboard');
      } else if (role === 'admin') {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  if (formType === 'signup') {
    return (
      <SignupForm 
        role={role} 
        additionalFields={additionalFields}
        onToggleForm={setFormType}
      />
    );
  }

  const portalTypes = {
    student: {
      icon: GraduationCap,
      color: 'blue',
      title: 'Student Portal',
      description: 'Access your academic profile and portfolio'
    },
    faculty: {
      icon: User,
      color: 'cyan',
      title: 'Faculty Portal',
      description: 'Manage students and approve activities'
    },
    admin: {
      icon: ShieldCheck,
      color: 'purple',
      title: 'Admin Portal',
      description: 'Complete system administration access'
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-6" style={{background:'var(--bg-dark)'}}>
      <div className="w-full max-w-2xl card p-8">
        <div className="flex items-center gap-3 mb-6">
          <GraduationCap className="w-8 h-8 text-brand-blue" />
          <div>
            <div className="text-2xl font-bold text-brand-blue">CODEVENGERS</div>
            <div className="text-sm" style={{color:'var(--text-secondary)'}}>
              {role ? `${role.charAt(0).toUpperCase() + role.slice(1)} Portal` : 'Choose Your Portal'}
            </div>
          </div>
        </div>

        {!role ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(portalTypes).map(([key, portal]) => {
              const Icon = portal.icon;
              return (
                <button
                  key={key}
                  onClick={() => navigate(`/login/${key}`)}
                  className={`p-6 rounded-xl border border-gray-700 hover:border-${portal.color}-500/30 hover:bg-${portal.color}-900/10 transition-all duration-300 hover:scale-105 text-left`}
                >
                  <Icon className={`w-8 h-8 mb-3 text-${portal.color}-400`} />
                  <h3 className="text-lg font-semibold text-white mb-2">{portal.title}</h3>
                  <p className="text-sm text-gray-400">{portal.description}</p>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 subtle">Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  className="w-full input-dark"
                  placeholder="you@college.edu"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 subtle">Password</label>
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type="password"
                  className="w-full input-dark"
                  placeholder="Your password"
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm">{error}</div>
              )}

              <div className="flex gap-2">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary w-full"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
                {!disableSignup && (
                  <button
                    type="button"
                    onClick={() => setFormType('signup')}
                    className="btn btn-outline w-full"
                    disabled={isLoading}
                  >
                    Create Account
                  </button>
                )}
              </div>

              <div className="text-center mt-4">
                <button 
                  type="button" 
                  onClick={() => navigate('/login')}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  ← Back to portal selection
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}