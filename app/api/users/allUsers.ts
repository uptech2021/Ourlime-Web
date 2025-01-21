import { db } from '@/lib/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}