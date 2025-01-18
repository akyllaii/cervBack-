import mongoose from "mongoose";


const EventSchema = new mongoose.Schema({
    responses: {
        going: { type: Number, default: 0 },
        maybe: { type: Number, default: 0 },
        no: { type: Number, default: 0 }
    },
    participants: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
            response: { type: String, enum: ['going', 'maybe', 'no'], required: true },
            name: { type: String },
            surname: { type: String }
        },
    ],
    })

export default mongoose.model('Event', EventSchema)
