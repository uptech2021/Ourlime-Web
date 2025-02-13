export type Event = {
    id?: string; // Optional ID for the event, useful for Firestore documents
    title: string; // Title of the event
    summary: string; // Description of the event
    startDate: string; // Start date of the event
    endDate: string; // End date of the event
    image?: string;
    location: string;
    userId: string;
}