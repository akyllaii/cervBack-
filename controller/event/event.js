import mongoose from 'mongoose';
import Event from '../../models/event.js';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get response counts for an event
// Fetch event responses and participants
// Get response counts and participants for an event
export const getEventResponses = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid event ID format' });
        }

        const event = await Event.findById(id).populate('participants.userId', 'name surname'); // Populate participant names

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Map the participants to get their initials
        const initials = event.participants.map(p => {
            const name = p.userId.name;
            const surname = p.userId.surname;
            return `${name[0]}${surname[0]}`.toUpperCase(); // Initials of name and surname
        });

        res.json({
            going: event.responses.going,
            maybe: event.responses.maybe,
            no: event.responses.no,
            initials, // Include initials of participants
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch event responses' });
    }
};



// Respond to an event
export const respondToEvent = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid event ID format' });
        }

        const { response } = req.body;

        if (!['going', 'maybe', 'no'].includes(response)) {
            return res.status(400).json({ message: 'Invalid response type' });
        }

        if (!req.userId) {
            return res.status(403).json({ message: 'User not authenticated' });
        }

        // Fetch event and check if user is already participating
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const userId = req.userId; // Use the user ID from the middleware

        // Check if the user is allowed to respond (e.g., if not already participated)
        const participantIndex = event.participants.findIndex(
            (p) => p.userId.toString() === userId.toString()
        );

        if (participantIndex !== -1) {
            return res.status(403).json({ message: 'User has already responded to this event' });
        }

        event.participants.push({ userId, response });
        event.responses[response]++;
        await event.save();

        res.json({
            going: event.responses.going,
            maybe: event.responses.maybe,
            no: event.responses.no,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to submit response' });
    }
};

