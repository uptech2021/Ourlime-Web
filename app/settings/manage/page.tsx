'use client';
import SettingsSidebar from "@/components/settings/nav/page";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { auth, db } from '@/lib/firebaseConfig';
import { doc, getDoc, updateDoc,arrayRemove } from "firebase/firestore";
import { ResizeListener } from '@/helpers/Resize';
import { useRouter } from 'next/navigation';
import { loginRedirect } from '@/helpers/Auth';

export default function Manage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const router = useRouter();
	const [, setIsPc] = useState<boolean>(false);
	const user = auth;

 
		const getCurrentSessionInfo = () => {
			const userAgent = navigator.userAgent;
			let browser = "Unknown";

			if (userAgent.indexOf("Chrome") > -1) {
				browser = "Google Chrome";
			} else if (userAgent.indexOf("Firefox") > -1) {
				browser = "Firefox";
			} else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
				browser = "Opera";
			} else if (userAgent.indexOf("Edg") > -1) {
				browser = "Microsoft Edge";
			} else if (userAgent.indexOf("Safari") > -1) {
				browser = "Safari";
			}

			return {
				device: navigator.platform,
				browser: browser,
				ipAddress: '::1'
			};
		};  

  

  const logoutAllSessions = async () => {
    const user = auth.currentUser;
    if (user) {
      const profileRef = doc(db, 'profiles', user.uid);
      await updateDoc(profileRef, {
        sessions: []
      });
      setSessions([]);
    }
  };

  const logoutSession = async (sessionId: string) => {
    const user = auth.currentUser;
    if (user) {
      const profileRef = doc(db, 'profiles', user.uid);
      await updateDoc(profileRef, {
        sessions: arrayRemove(sessions.find(s => s.id === sessionId))
      });
      setSessions(sessions.filter(s => s.id !== sessionId));
    }
  };
  useEffect(() => {
    const fetchSessions = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        const profileRef = doc(db, 'profiles', user.uid);
        const profileSnap = await getDoc(profileRef);
        
        if (userSnap.exists() && profileSnap.exists()) {
          const userData = userSnap.data();
          const profileData = profileSnap.data();
          const currentSession = {
            ...getCurrentSessionInfo(),
            lastActive: userData.last_loggedIn,
            id: Date.now().toString() 
          };
          
          let updatedSessions = profileData.sessions || [];
          if (!updatedSessions.some((s: { device: string; browser: string }) => 
            s.device === currentSession.device && 
            s.browser === currentSession.browser)) {
            updatedSessions = [...updatedSessions, currentSession];
            await updateDoc(profileRef, {
              sessions: updatedSessions
            });
          }
          setSessions(updatedSessions);
        }
      }
    };
  
    fetchSessions();
  }, []);
  


  useEffect(() => {
		loginRedirect(router)
		const cleanup = ResizeListener(setIsPc)
		return () => cleanup()
	}, [router]);

	if (!user.currentUser) {
		router.push('/login');
		return null;
	}

	else return (
    <>
      <div className='flex flex-row bg-gray-200 min-h-screen'>
        <SettingsSidebar />

        <main className="flex flex-col mx-auto">
          <div className="text-gray-600 bg-white p-4 rounded-lg shadow-md w-[90%] md:w-[40rem] mt-8 mx-auto">
		  <h1 className="text-ml lg:text-4xl text-left mb-6 font-bold text-gray-800">
              Manage Sessions
            </h1>
		  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
		 

  {sessions.map((session, index) => (
    <section key={index} className="min-h-[8rem] min-w-[6rem] rounded-lg border-2 border-gray-400 bg-white-100 p-4 mb-6">
     
      <div className="text-black-800">
	  <p className="text-sm font-bold">{session.device}</p>
      <p className="text-xs mt-1">{session.browser}</p>
      <p className="text-xs">Last Active: {session.lastActive.toDate().toLocaleString()}</p>
      <p className="text-xs">IP: {session.ipAddress}</p>
      </div>
	  <Button 
        className="mb-2 mt-2 h-8 w-full rounded px-2 py-2 text-sm text-white bg-red-500"
        onClick={() => logoutSession(session.id)}
      >
        Logout 
      </Button>
    </section>
  ))}
</div>
			

            <Button 
              className="mb-2 lg:mb-8 h-8 lg:h-10 w-[9rem] lg:w-[14rem] rounded px-2 py-2 text-[0.6rem] lg:text-[1rem] text-white bg-green-500"
              onClick={logoutAllSessions}
            >
              Logout From All Sessions
            </Button>
            
			

          </div>
        </main>
      </div>
    </>
  );
}
