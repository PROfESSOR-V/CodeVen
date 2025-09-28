import { BaseLoginForm } from '../../components/auth/BaseLoginForm';

export function FacultyLoginPage() {
  const additionalFields = [
    {
      name: 'facultyId',
      label: 'Faculty ID',
      required: true,
      placeholder: 'Enter your faculty ID'
    },
    {
      name: 'department',
      label: 'Department',
      required: true,
      placeholder: 'Your department'
    }
  ];

  const handleToggleForm = (formType) => {
    // Handle signup form toggle
    console.log('Toggle to:', formType);
  };

  return (
    <BaseLoginForm
      role="faculty"
      onToggleForm={handleToggleForm}
      additionalFields={additionalFields}
    />
  );
}