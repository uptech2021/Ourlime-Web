'use client';
import dynamic from 'next/dynamic';
import { Input } from '@nextui-org/react';
import { LatLngLiteral, Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import FilterBox from '@/components/settings/friend/filterBox';
import { db, auth } from '@/firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useEffect, useState, useRef } from 'react';

// Import Map components dynamically
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
);

const FindFriendsPage: React.FC = () => {
  const [friends, setFriends] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [gender, setGender] = useState('All');
  const [status, setStatus] = useState('All');
  const [distance, setDistance] = useState(1);
  const [relationship, setRelationship] = useState('All');

  const mapRef = useRef<LeafletMap>(null);

  const fetchFriends = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const friendUsernames = userDoc.data()?.friends || [];
  
      const friendsData = await Promise.all(
        friendUsernames.map(async (username: string) => {
          const userRef = doc(db, 'users', username);
          const userSnapshot = await getDoc(userRef);
  
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            const profilesRef = collection(db, 'profiles');
            const q = query(profilesRef, where('userName', '==', userData.userName));
            const querySnapshot = await getDocs(q);
  
            if (!querySnapshot.empty) {
              const profileData = querySnapshot.docs[0].data();
              return {
                ...userData,
                ...profileData,
                id: userSnapshot.id
              };
            }
          }
          return null;
        })
      );
  
      const validFriendss = friendsData.filter(friend => friend !== null);
      console.log("All Friends Data: ", validFriendss);
      setFriends(validFriendss);
    }
  };
  const logFriendsData = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const friendsData = userDoc.data()?.friends || [];
  
      console.log("Friends Data from user's friends field:", friendsData);
    }
  };
  
  
  
      
  
  

  useEffect(() => {
    fetchFriends();
  }, []);
  useEffect(() => {
    logFriendsData();
  }, []);
  

  // Filter friends based on the search term
  // Filter friends based on the userName search term
const filteredFriends = friends.filter(friend =>
  friend.userName.toLowerCase().includes(searchTerm.toLowerCase())
);

// Navigate to friend's location when Enter is pressed
const handleSearchSubmit = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter') {
    // Find the friend with the matching userName
    const foundFriend = friends.find(friend =>
      friend.userName.toLowerCase() === searchTerm.toLowerCase()
    );

    // Check if the friend has a valid location and pan the map to the friend's location
    if (foundFriend && foundFriend.location) {
      panToLocation(foundFriend.location);
    } else {
      alert('User not found or location not available');
    }
  }
};


  // Function to pan to the selected friend's location
  const panToLocation = (location: { latitude: number; longitude: number }) => {
    const map = mapRef.current; // Use mapRef instead of useMap
  
    if (map) {
      map.flyTo([location.latitude, location.longitude], 13); // Zoom to location
    } else {
      console.error("Map reference is not available.");
    }
  };
  
  



  return (
    <div className="find-friends-page m-0 flex w-full flex-col lg:flex-row lg:items-start lg:justify-between h-min-screen">
      {/* Map Section */}
      <div className="map-container h-[13rem] w-full bg-gray-200 lg:h-[55rem] lg:w-[45%] lg:top-0">
      <MapContainer
  center={{ lat: 0, lng: 0 } as LatLngLiteral}
  zoom={2}
  style={{ height: '100%', width: '100%' }}
  ref={(mapInstance: L.Map | null) => {
    if (mapInstance) {
      (mapRef as React.MutableRefObject<L.Map | null>).current = mapInstance; // Save the map instance in the ref
    }
  }}>

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
         {/* {filteredFriends.map(friend => (
  friend.location && (
    <Marker
      key={friend.userName}
      position={[friend.location.latitude, friend.location.longitude]}
      eventHandlers={{
        click: () => {
          console.log(`${friend.userName}'s location: `, friend.location);
        },
      }}
    >
      <Popup>{`${friend.userName}`}</Popup>
    </Marker>
  )
))}  */}

        </MapContainer>
      </div>

      {/* Search and Filters Section */}
      <div className="search-container mx-auto w-[90%] lg:w-[50%] lg:pl-8 lg:bg-white lg:pt-4">
        <h2 className="mb-2 text-xl lg:font-bold lg:text-black">Find friends</h2>
        <p className="ssl-warning mb-4 lg:mb-2 rounded bg-orange-100 p-1 lg:p-2 text-sm font-semibold text-orange-500">
          SSL is required to be able to use this feature. (Just admin can see this warning)
        </p>
        <div className="search-bar flex w-full lg:items-center">
          <Input
            type="text"
            label="Search for users"
            labelPlacement="outside"
            placeholder=" "
            className="search-input lg:mr-2 rounded-full p-1 lg:p-2 text-sm lg:flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchSubmit} // Handle Enter key press
          />
          <div
            className="filter-icon h-7 w-7 cursor-pointer rounded-full bg-green-500 p-4 lg:h-8 lg:w-8 lg:p-2.5 text-white mt-8"
            onClick={() => setShowFilters(!showFilters)}
          >
            {/* Add filter icon here */}
          </div>
        </div>
        
        {/* FilterBox Component */}
        <FilterBox
          showFilters={showFilters}
          gender={gender}
          setGender={setGender}
          status={status}
          setStatus={setStatus}
          distance={distance}
          setDistance={setDistance}
          relationship={relationship}
          setRelationship={setRelationship}
        />
      </div>
    </div>
  );

};
export default FindFriendsPage;
