import { db } from '@/lib/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const userRef = doc(db, 'users', id as string);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json({ id: userDoc.id, ...userDoc.data() });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}