import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Upload, Table2, UserSquare2, LogOut } from 'lucide-react';
import { Topbar } from '../components/Topbar.jsx';

export function StudentLayout() {
	const navigate = useNavigate();
	const logout = () => { localStorage.removeItem('role'); navigate('/login'); };

	const navLinkClass = ({ isActive }) =>
		`flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-200 ${
			isActive
				? 'bg-white/10 backdrop-blur-sm text-white font-medium shadow-sm'
				: 'text-gray-400 hover:text-white hover:bg-white/5'
		}`;

	return (
		<div className="min-h-screen">
			<aside className="fixed top-0 left-0 h-screen w-[240px] p-4 overflow-y-auto backdrop-blur-md" 
				style={{
					background: 'rgba(10, 18, 32, 0.95)',
					borderRight: '1px solid var(--border-color)'
				}}>
				<div className="mb-6">
					<a href="/" className="text-xl font-bold text-brand-blue">CODEVENGERS</a>
				</div>
				<nav className="flex flex-col gap-1">
					<a href="/landing" className={navLinkClass({ isActive: false })}>🏠 Homepage</a>
					<NavLink to="/student/dashboard" className={`${navLinkClass} relative overflow-hidden group`}>
						<div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
						<div className="relative z-10 flex items-center gap-3">
							<LayoutDashboard size={20} className="flex-shrink-0"/>
							<span>Dashboard</span>
						</div>
					</NavLink>
					<NavLink to="/student/activities" className={navLinkClass}><Table2 size={18}/> My Activities</NavLink>
					<NavLink to="/student/upload" className={navLinkClass}><Upload size={18}/> Upload</NavLink>
					<NavLink to="/student/portfolio" className={navLinkClass}><UserSquare2 size={18}/> Portfolio</NavLink>
					<NavLink to="/student/coding" className={navLinkClass}>⚡ Coding</NavLink>
					<NavLink to="/student/resume" className={navLinkClass}>📄 Resume Import</NavLink>
				</nav>
				<button className="btn btn-outline mt-6 w-full" onClick={logout}><LogOut size={16}/> Logout</button>
			</aside>
			<div className="ml-[240px] flex flex-col min-h-screen">
				<Topbar />
				<main className="p-6 space-y-6 flex-1">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
