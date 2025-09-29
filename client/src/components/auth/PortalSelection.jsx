import { GraduationCap, User, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PortalSelection() {
  const navigate = useNavigate();
  
  const portalTypes = [
    {
      id: 'student',
      icon: GraduationCap,
      color: 'blue',
      title: 'Student Portal',
      description: 'Access your academic profile and portfolio'
    },
    {
      id: 'faculty',
      icon: User,
      color: 'cyan',
      title: 'Faculty Portal',
      description: 'Manage students and approve activities'
    },
    {
      id: 'admin',
      icon: ShieldCheck,
      color: 'purple',
      title: 'Admin Portal',
      description: 'Complete system administration access'
    }
  ];

  return (
    <div className="min-h-screen grid place-items-center p-6" style={{background:'var(--bg-dark)'}}>
      <div className="w-full max-w-2xl card p-8">
        <div className="flex items-center gap-3 mb-6">
          <GraduationCap className="w-8 h-8 text-brand-blue" />
          <div>
            <div className="text-2xl font-bold text-brand-blue">CODEVENGERS</div>
            <div className="text-sm" style={{color:'var(--text-secondary)'}}>Choose Your Portal</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portalTypes.map(portal => {
            const Icon = portal.icon;
            return (
              <button
                key={portal.id}
                onClick={() => navigate(`/login/${portal.id}`)}
                className={`portal-card portal-card-${portal.color} p-6 rounded-xl border border-gray-700 transition-all duration-300 hover:scale-105 text-left`}
              >
                <Icon className={`w-8 h-8 mb-3 text-${portal.color}-400`} />
                <h3 className="text-lg font-semibold text-white mb-2">{portal.title}</h3>
                <p className="text-sm text-gray-400">{portal.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}