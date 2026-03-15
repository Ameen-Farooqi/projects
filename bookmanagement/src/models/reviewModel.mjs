import mongoose from "mongoose";
<<<<<<< HEAD
export const reviewSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Book ID is mandatory'],
        ref: 'Book' // Refers to the Book model
    },
    reviewedBy: {
        type: String,
        required: [true, "Reviewer's name is mandatory"],
        default: 'Guest',
        trim: true
    },
    reviewedAt: {
        type: Date,
        required: [true, 'Review date is mandatory']
    },
    rating: {
        type: Number,
        required: [true, 'Rating is mandatory'],
        min: [1, 'Rating cannot be less than 1'],
        max: [5, 'Rating cannot be more than 5']
    },
    review: {
        type: String,
        trim: true
        // This field is optional as it lacks 'required: true'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const reviewModel = mongoose.model('review', reviewSchema);
=======
const reviewSchema= new mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'books', required: true },
    reviewedBy: { type: String, required: true, default: 'Guest' },
    reviewedAt: { type: Date, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String },
    isDeleted: { type: Boolean, default: false },
},{timestamps:true})
const reviewModel= mongoose.model('reviews',reviewSchema);
>>>>>>> c4e10ef7b9c7a28a59d3b0716b7dc53d28d98020
export default reviewModel;