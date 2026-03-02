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
export default userModel;