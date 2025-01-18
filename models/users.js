import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true
        },
        surname: {
            type: String,
            required: true
        },
        passwordHash: {
            type: String,
            required: true
        }
}, {
        timestamps: true
}
)


export default mongoose.model('users', userSchema)