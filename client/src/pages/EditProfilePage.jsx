import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '../contexts/FirebaseAuthContext';

export function EditProfilePage() {
  const navigate = useNavigate();
  const { user } = useFirebaseAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    contactInfo: '',
    skills: [],
    socialLinks: {
      github: '',
      linkedin: '',
      portfolio: ''
    },
    certificates: [] // Array of certificate objects
  });

  // Fetch existing profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
          headers: {
            'Authorization': `Bearer ${await user.getIdToken()}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setProfileData(prevData => ({
            ...prevData,
            ...data
          }));
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle social links changes
  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value
      }
    }));
  };

  // Handle skills input
  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setProfileData(prev => ({
      ...prev,
      skills
    }));
  };

  // Handle certificate upload
  const handleCertificateUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('certificate', file);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/certificates/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: formData
      });

      if (response.ok) {
        const { certificateUrl } = await response.json();
        setProfileData(prev => ({
          ...prev,
          certificates: [...prev.certificates, {
            name: file.name,
            url: certificateUrl,
            uploadDate: new Date().toISOString()
          }]
        }));
      }
    } catch (err) {
      console.error('Error uploading certificate:', err);
      setError('Failed to upload certificate');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        navigate('/profile');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              className="w-full input-dark"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleChange}
              className="w-full input-dark h-24"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contact Info</label>
            <input
              type="text"
              name="contactInfo"
              value={profileData.contactInfo}
              onChange={handleChange}
              className="w-full input-dark"
              placeholder="Phone or alternate email"
            />
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Skills</h2>
          <div>
            <label className="block text-sm font-medium mb-1">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              value={profileData.skills.join(', ')}
              onChange={handleSkillsChange}
              className="w-full input-dark"
              placeholder="React, JavaScript, Node.js"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Social Links</h2>
          
          <div>
            <label className="block text-sm font-medium mb-1">GitHub</label>
            <input
              type="url"
              name="github"
              value={profileData.socialLinks.github}
              onChange={handleSocialChange}
              className="w-full input-dark"
              placeholder="https://github.com/yourusername"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              value={profileData.socialLinks.linkedin}
              onChange={handleSocialChange}
              className="w-full input-dark"
              placeholder="https://linkedin.com/in/yourusername"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Portfolio</label>
            <input
              type="url"
              name="portfolio"
              value={profileData.socialLinks.portfolio}
              onChange={handleSocialChange}
              className="w-full input-dark"
              placeholder="https://yourportfolio.com"
            />
          </div>
        </div>

        {/* Certificates */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Certificates</h2>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Upload New Certificate
            </label>
            <input
              type="file"
              onChange={handleCertificateUpload}
              className="w-full"
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>

          {profileData.certificates.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Uploaded Certificates</h3>
              <ul className="list-disc pl-5">
                {profileData.certificates.map((cert, index) => (
                  <li key={index}>
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {cert.name}
                    </a>
                    <span className="text-sm text-gray-500 ml-2">
                      {new Date(cert.uploadDate).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}