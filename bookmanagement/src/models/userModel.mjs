<<<<<<< HEAD
import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is mandatory'],
        enum: ['Mr', 'Mrs', 'Miss']
    },
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        pincode: { type: String, trim: true }
    }
}, { timestamps: true });

const userModel = mongoose.model('User', userSchema);
=======
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
>>>>>>> c4e10ef7b9c7a28a59d3b0716b7dc53d28d98020
export default userModel;