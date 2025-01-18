import express from 'express';
import mongoose from "mongoose";
import {register, login, resetPassword} from "./controller/usersMongo/usersMongo.js";
import {
    loginUserValidation,
    registerUserValidation,
    resetPasswordValidation
} from "./validations/validations.js";
import handleValidators from "./validations/validations.js";
import checkAuth from "./validations/checkAuth.js";
import {getAllUser, getOneUser} from "./controller/users/user.js";
import cors from 'cors'
import { getEventResponses, respondToEvent } from './controller/event/event.js'



const api = express();
api.use(express.json())
api.use(cors())
const PORT = process.env.PORT || 4444;

const mongoDbPass = 'akylai123'
mongoose.connect(`mongodb+srv://omurbekovaakylai:${mongoDbPass}@itrun.jtifz9k.mongodb.net/?retryWrites=true&w=majority&family=4`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
})
    .then(() => console.log('mongo успещно завпущен'))
    .catch((err) => console.log('error',err))

api.post('/register',registerUserValidation,handleValidators, register)
api.post('/login',loginUserValidation,handleValidators, login)
api.patch('/reset/password',resetPasswordValidation, handleValidators, checkAuth, resetPassword)

api.get('/users', getAllUser)
api.get('/users/:id', getOneUser)


api.get('/events/:id/responses', getEventResponses); // Get response counts
api.post('/events/:id/respond', checkAuth, respondToEvent); // Respond to an event


api.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
