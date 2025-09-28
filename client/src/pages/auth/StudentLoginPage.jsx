import { BaseLoginForm } from '../../components/auth/BaseLoginForm';

export function StudentLoginPage() {
  const additionalFields = [
    {
      name: 'studentId',
      label: 'Student ID',
      required: true,
      placeholder: 'Enter your student ID'
    },
    {
      name: 'semester',
      label: 'Semester',
      type: 'number',
      required: true,
      placeholder: 'Current semester (1-8)'
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
      role="student"
      onToggleForm={handleToggleForm}
      additionalFields={additionalFields}
    />
  );
}