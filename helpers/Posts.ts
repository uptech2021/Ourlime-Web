import { Timestamp } from "firebase/firestore";

// Function to format the Firebase timestamp into a readable format
export const formatDate = (timestamp: any) => {
	let date: Date;

	if (
		timestamp &&
		typeof timestamp.seconds === 'number' &&
		typeof timestamp.nanoseconds === 'number'
	) {
		// Create a new Firebase Timestamp
		const firebaseTimestamp = new Timestamp(
			timestamp.seconds,
			timestamp.nanoseconds
		);
		date = firebaseTimestamp.toDate();
	} else if (timestamp instanceof Date) {
		date = timestamp;
	} else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
		date = new Date(timestamp);
	} else {
		return 'Invalid Date';
	}

	return date.toLocaleString();
};
