import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig';
import { fetchProfile, fetchUser } from '@/helpers/Auth';
import { ProfileData, UserData } from '@/types/global';
import { onAuthStateChanged } from 'firebase/auth';

export default function About() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [originalProfile, setOriginalProfile] = useState<ProfileData | null>(null); // Original profile data for cancel
  const [originalUserData, setOriginalUserData] = useState<UserData | null>(null); // Original user data for cancel
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState({
    birthday: false,
    country: false,
    school: false,
    workingAt: false,
    gender: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const loadProfileData = async () => {
          try {
            const profileSnap = await fetchProfile(currentUser.uid);
            const userSnap = await fetchUser(currentUser.uid);

            if (profileSnap.exists() && userSnap.exists()) {
              const profileData = profileSnap.data() as ProfileData;
              const userData = userSnap.data() as UserData;
              setProfile(profileData);
              setUserData(userData);
              setOriginalProfile(profileData); // Set original profile data
              setOriginalUserData(userData);   // Set original user data
            } else {
              console.log("No profile or user data found.");
            }
          } catch (error) {
            console.error("Error loading profile data:", error);
          } finally {
            setLoading(false);
          }
        };

        loadProfileData();
      } else {
        setUser(null);
        setProfile(null);
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEditToggle = (field: string) => {
    setIsEditing((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));

    // Save original data when editing starts
    if (!isEditing[field]) {
      setOriginalProfile(profile);
      setOriginalUserData(userData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, type: 'profile' | 'user') => {
    if (type === 'profile' && profile) {
      setProfile({
        ...profile,
        [field]: e.target.value,
      });
    } else if (type === 'user' && userData) {
      setUserData({
        ...userData,
        [field]: e.target.value,
      });
    }
  };

  const handleSave = async (field: string, type: 'profile' | 'user') => {
    if (user) {
      try {
        const docRef = doc(db, type === 'profile' ? 'profiles' : 'users', user.uid);
        if (type === 'profile' && profile) {
          await updateDoc(docRef, { [field]: profile[field as keyof ProfileData] });
        } else if (type === 'user' && userData) {
          await updateDoc(docRef, { [field]: userData[field as keyof UserData] });
        }
        handleEditToggle(field);
      } catch (error) {
        console.error("Error saving data:", error);
      }
    }
  };

  const handleCancel = (field: string) => {
    // Revert to original data on cancel
    if (profile && originalProfile) {
      setProfile(originalProfile);
    }
    if (userData && originalUserData) {
      setUserData(originalUserData);
    }
    handleEditToggle(field);
  };

  const renderField = (label: string, field: string, value: string | undefined, type: 'profile' | 'user') => (
    <div className="mb-4">
      <label className="font-semibold">{label}:</label>
      {isEditing[field] ? (
        <div>
          <input
            name={field}
            type="text"
            value={value || ''}
            onChange={(e) => handleChange(e, field, type)}
            className="mt-2 w-full rounded border px-2 py-1"
            placeholder={`Enter your ${label}`}
          />
          <button
            onClick={() => handleSave(field, type)}
            className="mt-2 rounded bg-green-400 px-4 py-2 text-white"
          >
            Save
          </button>
          <button
            onClick={() => handleCancel(field)}
            className="mt-2 rounded bg-gray-400 px-4 py-2 text-white ml-2"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <p className="mt-2 text-gray-700">{value || `Add ${label}`}</p>
          <button
            onClick={() => handleEditToggle(field)}
            className="mt-2 text-blue-600"
          >
            {value ? 'Edit' : 'Add'}
          </button>
        </div>
      )}
    </div>
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-lg">
      <h2 className="mb-2 border-b pb-2 text-lg font-semibold">About</h2>
      {profile && renderField('Birthday', 'birthday', profile.birthday, 'profile')}
      {userData && renderField('Gender', 'gender', userData.gender, 'user')}
      {profile && renderField('Job', 'workingAt', profile.workingAt, 'profile')}
      {profile && renderField('School', 'school', profile.school, 'profile')}
      {profile && renderField('Country', 'country', profile.country, 'profile')}
    </div>
  );
}
