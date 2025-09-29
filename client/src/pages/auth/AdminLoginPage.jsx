import { BaseLoginForm } from '../../components/auth/BaseLoginForm';

export function AdminLoginPage() {
  const additionalFields = [
    {
      name: 'adminId',
      label: 'Admin ID',
      required: true,
      placeholder: 'Enter your admin ID'
    },
    {
      name: 'adminRole',
      label: 'Administrative Role',
      type: 'select',
      required: true,
      placeholder: 'Select your role',
      options: [
        'System Administrator',
        'Academic Administrator',
        'Department Administrator',
        'Placement Coordinator',
        'Event Coordinator'
      ]
    },
    {
      name: 'department',
      label: 'Department',
      type: 'select',
      required: true,
      placeholder: 'Select your department',
      options: [
        'Computer Science',
        'Information Technology',
        'Electrical Engineering',
        'Electronics & Communication',
        'Mechanical Engineering',
        'Civil Engineering',
        'Chemical Engineering',
        'BioTechnology'
      ]
    },
    {
      name: 'designation',
      label: 'Designation',
      type: 'select',
      required: true,
      placeholder: 'Select your designation',
      options: [
        'Head of Department',
        'Dean',
        'Principal',
        'Director',
        'System Administrator',
        'Technical Administrator'
      ]
    },
    {
      name: 'accessLevel',
      label: 'Access Level',
      type: 'select',
      required: true,
      placeholder: 'Select access level',
      options: [
        'Full Access',
        'Department Level',
        'View Only'
      ]
    }
  ];

  return (
    <BaseLoginForm
      role="admin"
      additionalFields={additionalFields}
      disableSignup={false} // Enable signup for admins
    />
  );
}