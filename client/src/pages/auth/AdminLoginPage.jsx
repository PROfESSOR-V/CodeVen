import { BaseLoginForm } from '../../components/auth/BaseLoginForm';

export function AdminLoginPage() {
  const handleToggleForm = (formType) => {
    // Admin signup is typically handled differently, maybe through a superadmin
    console.log('Admin signup not available');
  };

  return (
    <BaseLoginForm
      role="admin"
      onToggleForm={handleToggleForm}
    />
  );
}