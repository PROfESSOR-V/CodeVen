import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function FacultyAdminAuth() {
	const [mode, setMode] = useState('login');
	const [role, setRole] = useState('faculty');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const navigate = useNavigate();

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
		
		// If validation passes, proceed with login/signup
		localStorage.setItem('role', role);
		localStorage.setItem('isAuthenticated', 'true');
		console.log(`${role} ${mode} successful, redirecting to /${role}`);
		if (role === 'faculty') {
			window.location.href = '/faculty';
		} else if (role === 'admin') {
			window.location.href = '/admin';
		}
	};
	return (
		<div className="min-h-screen grid place-items-center p-6" style={{background:'var(--bg-dark)'}}>
			<div className="w-full max-w-md card p-6">
				<div className="mb-4 font-semibold">{mode === 'login' ? 'Faculty/Admin Login' : 'Faculty/Admin Signup'}</div>
				<div className="flex gap-2 mb-4">
					<button className={`btn ${role==='faculty'?'btn-primary':'btn-outline'}`} onClick={()=>setRole('faculty')}>Faculty</button>
					<button className={`btn ${role==='admin'?'btn-primary':'btn-outline'}`} onClick={()=>setRole('admin')}>Admin</button>
				</div>
				<form onSubmit={submit} className="space-y-3">
					<div>
						<input className="w-full input-dark" placeholder="Email" type="email" value={email} onChange={handleEmailChange} />
						{emailError && <div className="text-red-400 text-sm mt-1">{emailError}</div>}
					</div>
					<div>
						<input className="w-full input-dark" placeholder="Password" type="password" value={password} onChange={handlePasswordChange} />
						{passwordError && <div className="text-red-400 text-sm mt-1">{passwordError}</div>}
					</div>
					<button className="btn btn-primary w-full" type="submit">{mode==='login'?'Login':'Sign up'}</button>
				</form>
				<button className="text-sm mt-3 text-brand-blue" onClick={()=>setMode(mode==='login'?'signup':'login')}>
					{mode==='login'?'Create an account':'Have an account? Login'}
				</button>
			</div>
		</div>
	);
}
