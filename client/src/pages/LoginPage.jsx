import { useState } from 'react';
import { GraduationCap, User, ShieldCheck, GraduationCap as StudentIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation.js';

export function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [selectedOption, setSelectedOption] = useState(null); // No default selection
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const navigate = useNavigate();

	// Scroll animation hooks
	const containerRef = useScrollAnimation({ animationClass: 'fade-in-scale', delay: 0.2 });

	// Validation functions
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

	const handleEmailChange = (e) => {
		const value = e.target.value;
		setEmail(value);
		if (value && !validateEmail(value)) {
			setEmailError('Please enter a valid email address');
		} else {
			setEmailError('');
		}
	};

	const handlePasswordChange = (e) => {
		const value = e.target.value;
		setPassword(value);
		if (value) {
			const validation = validatePassword(value);
			if (!validation.isValid) {
				const errors = [];
				if (!validation.hasMinLength) errors.push('at least 8 characters');
				if (!validation.hasUpperCase) errors.push('one uppercase letter');
				if (!validation.hasLowerCase) errors.push('one lowercase letter');
				if (!validation.hasNumbers) errors.push('one number');
				if (!validation.hasSpecialChar) errors.push('one special character');
				setPasswordError(`Password must contain ${errors.join(', ')}`);
			} else {
				setPasswordError('');
			}
		} else {
			setPasswordError('');
		}
	};

	const submit = (e) => {
		e.preventDefault();
		
		// Clear previous errors
		setEmailError('');
		setPasswordError('');
		
		// Validate email
		if (!email.trim()) {
			setEmailError('Email is required');
			return;
		}
		if (!validateEmail(email)) {
			setEmailError('Please enter a valid email address');
			return;
		}
		
		// Validate password
		if (!password.trim()) {
			setPasswordError('Password is required');
			return;
		}
		const passwordValidation = validatePassword(password);
		if (!passwordValidation.isValid) {
			const errors = [];
			if (!passwordValidation.hasMinLength) errors.push('at least 8 characters');
			if (!passwordValidation.hasUpperCase) errors.push('one uppercase letter');
			if (!passwordValidation.hasLowerCase) errors.push('one lowercase letter');
			if (!passwordValidation.hasNumbers) errors.push('one number');
			if (!passwordValidation.hasSpecialChar) errors.push('one special character');
			setPasswordError(`Password must contain ${errors.join(', ')}`);
			return;
		}
		
		// If validation passes, proceed with login
		console.log('Form submitted:', { email, password, role });
		localStorage.setItem('role', role);
		localStorage.setItem('isAuthenticated', 'true');
		console.log('Login successful, redirecting to:', role === 'student' ? '/student' : '/verify');
		
		// Use window.location for more reliable navigation
		if (role === 'student') {
			window.location.href = '/student';
		} else if (role === 'faculty') {
			window.location.href = '/faculty';
		} else if (role === 'admin') {
			window.location.href = '/admin';
		}
	};

	return (
		<div className="min-h-screen grid place-items-center p-6" style={{background:'var(--bg-dark)'}}>
			<div ref={containerRef} className="w-full max-w-2xl space-y-6">
				<div className="card p-8 gpu-accelerated hover:scale-105 transition-transform">
					<div className="flex items-center gap-3 mb-6">
						<GraduationCap className="w-8 h-8 text-brand-blue" />
						<div>
							<div className="text-2xl font-bold text-brand-blue">CODEVENGERS</div>
							<div className="text-sm" style={{color:'var(--text-secondary)'}}>Choose Your Portal</div>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						{/* Student Option */}
						<button
							onClick={() => setSelectedOption('student')}
							className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 text-left ${
								selectedOption === 'student' 
									? 'bg-blue-900/20 border-blue-500/50' 
									: 'border-gray-700 hover:border-blue-500/30 hover:bg-blue-900/10'
							}`}
						>
							<StudentIcon className="w-8 h-8 mb-3 text-blue-400" />
							<h3 className="text-lg font-semibold text-white mb-2">Student Portal</h3>
							<p className="text-sm text-gray-400">Access your academic profile and portfolio</p>
						</button>

						{/* Faculty Option */}
						<button
							onClick={() => setSelectedOption('faculty')}
							className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 text-left ${
								selectedOption === 'faculty' 
									? 'bg-cyan-900/20 border-cyan-500/50' 
									: 'border-gray-700 hover:border-cyan-500/30 hover:bg-cyan-900/10'
							}`}
						>
							<User className="w-8 h-8 mb-3 text-cyan-400" />
							<h3 className="text-lg font-semibold text-white mb-2">Faculty Portal</h3>
							<p className="text-sm text-gray-400">Manage students and approve activities</p>
						</button>

						{/* Admin Option */}
						<button
							onClick={() => setSelectedOption('admin')}
							className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 text-left ${
								selectedOption === 'admin' 
									? 'bg-purple-900/20 border-purple-500/50' 
									: 'border-gray-700 hover:border-purple-500/30 hover:bg-purple-900/10'
							}`}
						>
							<ShieldCheck className="w-8 h-8 mb-3 text-purple-400" />
							<h3 className="text-lg font-semibold text-white mb-2">Admin Portal</h3>
							<p className="text-sm text-gray-400">Complete system administration access</p>
						</button>
					</div>

					{selectedOption === 'student' ? (
						/* Student Login Form */
						<form onSubmit={submit} className="space-y-4 max-w-md mx-auto">
							<div>
								<label className="block text-sm mb-1 subtle">Email</label>
								<input value={email} onChange={handleEmailChange} required type="email" className="w-full input-dark" placeholder="you@college.edu" />
								{emailError && <div className="text-red-400 text-sm mt-1">{emailError}</div>}
							</div>
							<div>
								<label className="block text-sm mb-1 subtle">Password</label>
								<input value={password} onChange={handlePasswordChange} required type="password" className="w-full input-dark" />
								{passwordError && <div className="text-red-400 text-sm mt-1">{passwordError}</div>}
							</div>
							<div className="flex gap-2">
								<button className="btn btn-primary w-full" type="submit">Login as Student</button>
								<button className="btn btn-outline w-full" type="button">Sign up</button>
							</div>
							<div className="text-center">
								<button type="button" className="text-sm text-brand-blue hover:underline">Forgot Password?</button>
							</div>
						</form>
					) : selectedOption && (
						<div className="text-center">
							<button
								onClick={() => {
									localStorage.setItem('role', selectedOption);
									localStorage.setItem('isAuthenticated', 'true');
									window.location.href = `/${selectedOption}`;
								}}
								className={`btn py-3 px-8 text-lg font-semibold ${
									selectedOption === 'faculty' 
										? 'btn-outline-cyan' 
										: selectedOption === 'admin' 
											? 'btn-outline-purple' 
											: 'btn-primary'
								}`}
							>
								Access {selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)} Dashboard
							</button>
						</div>
					)}

					{selectedOption && (
						<div className="mt-4 text-center">
							<button 
								onClick={() => setSelectedOption(null)}
								className="text-sm text-gray-400 hover:text-white transition-colors"
							>
								← Back to portal selection
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
