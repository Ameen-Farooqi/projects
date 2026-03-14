import mongoose from "mongoose";
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const userSchema = new mongoose.Schema({
    title: { type: String, required: true, enum: ['Mr', 'Mrs', 'Miss'] },
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, match: [emailRegex, 'Please fill a valid email address.'] },
    password: { type: String, required: true },
    address: { 
        street: { type: String },
        city: { type: String },
        pincode: { type: String }
    }
},{timestamps:true})
const userModel = mongoose.model('user', userSchema);
export default userModel;