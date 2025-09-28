import { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import { useNavigate } from 'react-router-dom';

export function BaseLoginForm({ role, onToggleForm, additionalFields = [] }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    ...additionalFields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  });
  const [errors, setErrors] = useState({});
  const { login } = useAuth();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;
    
    return {
      isValid: hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      hasMinLength
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        const errorParts = [];
        if (!passwordValidation.hasMinLength) errorParts.push('at least 8 characters');
        if (!passwordValidation.hasUpperCase) errorParts.push('one uppercase letter');
        if (!passwordValidation.hasLowerCase) errorParts.push('one lowercase letter');
        if (!passwordValidation.hasNumbers) errorParts.push('one number');
        if (!passwordValidation.hasSpecialChar) errorParts.push('one special character');
        newErrors.password = `Password must contain ${errorParts.join(', ')}`;
      }
    }

    // Validate additional fields
    additionalFields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // First authenticate with Firebase
        const user = await login(formData.email, formData.password);
        
        // Get the ID token
        const token = await user.getIdToken();

        // After successful Firebase auth, register in your backend with role-specific data
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            firebaseUid: user.uid,
            name: formData.name || user.displayName,
            email: user.email,
            role,
            ...Object.fromEntries(
              additionalFields.map(field => [field.name, formData[field.name]])
            )
          })
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Registration failed');
        }

        // Navigate to appropriate dashboard based on role
        navigate(`/${role}/dashboard`);
      } catch (error) {
        setErrors({ submit: error.message });
      }
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-6" style={{background:'var(--bg-dark)'}}>
      <div className="w-full max-w-md card p-6 gpu-accelerated hover:scale-105 transition-transform">
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="text-brand-blue" />
          <div>
            <div className="text-lg font-semibold text-brand-blue">JECRC University</div>
            <div className="text-sm" style={{color:'var(--text-secondary)'}}>CODEVENGERS Platform</div>
          </div>
        </div>
        
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
            {errors.email && <div className="text-red-400 text-sm mt-1">{errors.email}</div>}
          </div>

          <div>
            <label className="block text-sm mb-1 subtle">Password</label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              className="w-full input-dark"
            />
            {errors.password && <div className="text-red-400 text-sm mt-1">{errors.password}</div>}
          </div>

          {additionalFields.map(field => (
            <div key={field.name}>
              <label className="block text-sm mb-1 subtle">{field.label}</label>
              <input
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                type={field.type || 'text'}
                className="w-full input-dark"
                placeholder={field.placeholder}
              />
              {errors[field.name] && (
                <div className="text-red-400 text-sm mt-1">{errors[field.name]}</div>
              )}
            </div>
          ))}

          {errors.submit && (
            <div className="text-red-400 text-sm">{errors.submit}</div>
          )}

          <div className="flex gap-2">
            <button className="btn btn-primary w-full" type="submit">
              Login as {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
            <button
              className="btn btn-outline w-full"
              type="button"
              onClick={() => onToggleForm('signup')}
            >
              Sign up
            </button>
          </div>

          <button
            type="button"
            className="text-sm text-brand-blue"
          >
            Forgot Password?
          </button>
        </form>
      </div>
    </div>
  );
}