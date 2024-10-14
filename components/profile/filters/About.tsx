import { useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export default function About({ user }) {
  const [aboutData, setAboutData] = useState({
    workplace: '',
    secondarySchool: '',
    university: '',
    currentCity: '',
    hometown: '',
    relationshipStatus: '',
  });

  const [isEditing, setIsEditing] = useState({
    workplace: false,
    secondarySchool: false,
    university: false,
    currentCity: false,
    hometown: false,
    relationshipStatus: false,
  });

  const handleEditToggle = (field) => {
    setIsEditing((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleChange = (e, field) => {
    setAboutData((prevState) => ({
      ...prevState,
      [field]: e.target.value,
    }));
  };

  const handleSave = async (field) => {
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { [field]: aboutData[field] });
    handleEditToggle(field); // Close edit mode
  };

  const renderField = (label, field) => (
    <div className="mb-4">
      <label className="font-semibold">{label}:</label>
      {isEditing[field] ? (
        <div>
          <input
            name="about"
            type="text"
            value={aboutData[field]}
            onChange={(e) => handleChange(e, field)}
            className="mt-2 w-full rounded border px-2 py-1"
            placeholder={`Enter your ${label}`}
          />
          <button
            onClick={() => handleSave(field)}
            className="mt-2 rounded bg-green-400 px-4 py-2 text-white"
          >
            Save
          </button>
        </div>
      ) : (
        <div>
          <p className="mt-2 text-gray-700">{aboutData[field] || 'Add ' + label}</p>
          <button
            onClick={() => handleEditToggle(field)}
            className="mt-2 text-blue-600"
          >
            {aboutData[field] ? 'Edit' : 'Add'}
          </button>
        </div>
      )}
    </div>
  );
  return (
    <div className="rounded-xl bg-white p-4 shadow-lg">
      <h2 className="mb-2 border-b pb-2 text-lg font-semibold">About</h2>
      {renderField('Workplace', 'workplace')}
      {renderField('Secondary School', 'secondarySchool')}
      {renderField('University', 'university')}
      {renderField('Current City', 'currentCity')}
      {renderField('Hometown', 'hometown')}
      {renderField('Relationship Status', 'relationshipStatus')}
    </div>
  );
}
