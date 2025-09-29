import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import { ProfileProvider } from './contexts/ProfileContext.jsx';
import { FirebaseAuthProvider, useFirebaseAuth } from './contexts/FirebaseAuthContext';
import { useAuth, AuthProvider } from './contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
	const { isAuthenticated, user, role, isLoading } = useAuth();
	const navigate = useNavigate();
	
	console.log('ProtectedRoute check:', { isAuthenticated, user, role, isLoading, allowedRoles, path: window.location.pathname });
	
	useEffect(() => {
		if (!isLoading) {
			if (!isAuthenticated) {
				console.log('Not authenticated, redirecting to login');
				navigate('/login', { replace: true });
			} else if (!role || !allowedRoles.includes(role)) {
				console.log('Access denied - invalid role:', role);
				navigate(`/login/${role || ''}`, { replace: true });
			}
		}
	}, [isAuthenticated, role, isLoading, allowedRoles, navigate]);
	
	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}
	
	if (!isAuthenticated || !role || !allowedRoles.includes(role)) {
		return null;
	}
	
	console.log('Access granted for role:', role);
	return <>{children}</>;
}

// Auth pages
import { StudentLoginPage } from './pages/auth/StudentLoginPage';
import { FacultyLoginPage } from './pages/auth/FacultyLoginPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';
import { LandingPage } from './pages/LandingPage.jsx';
import { LandingPageTest } from './pages/LandingPageTest.jsx';
import { LandingPageSimple } from './pages/LandingPageSimple.jsx';
import { StudentLayout } from './layouts/StudentLayout.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { UploadPage } from './pages/UploadPage.jsx';
import { ActivitiesPage } from './pages/ActivitiesPage.jsx';
import { PortfolioPage } from './pages/PortfolioPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { CodingPage } from './pages/CodingPage.jsx';
import { ResumeImportPage } from './pages/ResumeImportPage.jsx';
import { FacultyAdminAuth } from './pages/AuthFacultyAdmin.jsx';
import { FacultyLayout } from './layouts/FacultyLayout.jsx';
import { AdminLayout } from './layouts/AdminLayout.jsx';
import { FacultyDashboard } from './pages/FacultyDashboard.jsx';
import { FacultyApprovals } from './pages/FacultyApprovals.jsx';
import { FacultyStudents } from './pages/FacultyStudents.jsx';
import { FacultyStudent360 } from './pages/FacultyStudent360.jsx';
import { AdminDashboard } from './pages/AdminDashboard.jsx';
import { AdminAnalytics } from './pages/AdminAnalytics.jsx';
import { AdminPlacements } from './pages/AdminPlacements.jsx';
import { AdminEvents } from './pages/AdminEvents.jsx';
import { VerifierPage } from './pages/VerifierPage.jsx';
import { EditProfilePage } from './pages/EditProfilePage.jsx';
import { PortalSelection } from './components/auth/PortalSelection.jsx';

export default function App() {
	return (
		<FirebaseAuthProvider>
			<AuthProvider>
				<ProfileProvider>
					<BrowserRouter>
						<Routes>
					<Route path="/" element={<LandingPageSimple />} />
					<Route path="/login">
						<Route index element={<PortalSelection />} />
						<Route path="student" element={<StudentLoginPage />} />
						<Route path="faculty" element={<FacultyLoginPage />} />
						<Route path="admin" element={<AdminLoginPage />} />
					</Route>
					<Route path="/student" element={
						<ProtectedRoute allowedRoles={['student']}>
							<StudentLayout />
						</ProtectedRoute>
					}>
						<Route index element={<Navigate to="dashboard" replace />} />
						<Route path="dashboard" element={<DashboardPage />} />
						<Route path="upload" element={<UploadPage />} />
						<Route path="activities" element={<ActivitiesPage />} />
						<Route path="portfolio" element={<PortfolioPage />} />
						<Route path="profile" element={<ProfilePage />} />
						<Route path="edit-profile" element={<EditProfilePage />} />
						<Route path="coding" element={<CodingPage />} />
						<Route path="resume" element={<ResumeImportPage />} />
						<Route path="*" element={<Navigate to="dashboard" replace />} />
					</Route>

					<Route path="/faculty" element={
						<ProtectedRoute allowedRoles={['faculty']}>
							<FacultyLayout />
						</ProtectedRoute>
					}>
						<Route index element={<Navigate to="dashboard" replace />} />
						<Route path="dashboard" element={<FacultyDashboard />} />
						<Route path="approvals" element={<FacultyApprovals />} />
						<Route path="students" element={<FacultyStudents />} />
						<Route path="mentor" element={<FacultyStudent360 />} />
						<Route path="*" element={<Navigate to="dashboard" replace />} />
					</Route>

					<Route path="/admin" element={
						<ProtectedRoute allowedRoles={['admin']}>
							<AdminLayout />
						</ProtectedRoute>
					}>
						<Route index element={<Navigate to="dashboard" replace />} />
						<Route path="dashboard" element={<AdminDashboard />} />
						<Route path="approvals" element={<FacultyApprovals />} />
						<Route path="analytics" element={<AdminAnalytics />} />
						<Route path="placements" element={<AdminPlacements />} />
						<Route path="events" element={<AdminEvents />} />
						<Route path="*" element={<Navigate to="dashboard" replace />} />
					</Route>

					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</BrowserRouter>
		</ProfileProvider>
		</AuthProvider>
		</FirebaseAuthProvider>
	);
}
