import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { ProfileProvider } from './contexts/ProfileContext.jsx';

function ProtectedRoute({ children, allowedRoles }) {
	const role = localStorage.getItem('role');
	const isAuth = localStorage.getItem('isAuthenticated');
	
	console.log('ProtectedRoute check:', { role, isAuth, allowedRoles, path: window.location.pathname });
	
	if (!role || !allowedRoles.includes(role)) {
		console.log('Access denied, redirecting to login');
		return <Navigate to="/login" replace />;
	}
	
	console.log('Access granted');
	return <>{children}</>;
}
import { LoginPage } from './pages/LoginPage.jsx';
import { LandingPage } from './pages/LandingPage.jsx';
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

export default function App() {
	return (
		<ProfileProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<LandingPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/auth" element={<FacultyAdminAuth />} />
					
					<Route path="/student" element={
						<ProtectedRoute allowedRoles={['student']}>
							<StudentLayout />
						</ProtectedRoute>
					}>
						<Route index element={<DashboardPage />} />
						<Route path="dashboard" element={<DashboardPage />} />
						<Route path="upload" element={<UploadPage />} />
						<Route path="activities" element={<ActivitiesPage />} />
						<Route path="portfolio" element={<PortfolioPage />} />
						<Route path="profile" element={<ProfilePage />} />
						<Route path="coding" element={<CodingPage />} />
						<Route path="resume" element={<ResumeImportPage />} />
					</Route>

					<Route path="/faculty" element={
						<ProtectedRoute allowedRoles={['faculty']}>
							<FacultyLayout />
						</ProtectedRoute>
					}>
						<Route index element={<FacultyDashboard />} />
						<Route path="approvals" element={<FacultyApprovals />} />
						<Route path="students" element={<FacultyStudents />} />
						<Route path="mentor" element={<FacultyStudent360 />} />
					</Route>

					<Route path="/admin" element={
						<ProtectedRoute allowedRoles={['admin']}>
							<AdminLayout />
						</ProtectedRoute>
					}>
						<Route index element={<AdminDashboard />} />
						<Route path="approvals" element={<FacultyApprovals />} />
						<Route path="analytics" element={<AdminAnalytics />} />
						<Route path="placements" element={<AdminPlacements />} />
						<Route path="events" element={<AdminEvents />} />
					</Route>

					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</BrowserRouter>
		</ProfileProvider>
	);
}
