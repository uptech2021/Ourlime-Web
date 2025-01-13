import { Timestamp } from "firebase/firestore";

// Function to format the Firebase timestamp into a readable format
// @param timestamp the timestamp to format
// @return {string} the formatted timestamp
export const formatDate = (timestamp: any) => {
	let date: Date;

	// If the timestamp is a Firebase Timestamp object
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
		// If the timestamp is a JavaScript Date object
		date = timestamp;
	} else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
		// If the timestamp is a string or number
		date = new Date(timestamp);
	} else {
		return 'Invalid Date';
	}

	// Return the formatted timestamp as a string
	return date.toLocaleString();
};
