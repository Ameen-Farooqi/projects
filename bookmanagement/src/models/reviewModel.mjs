import mongoose from "mongoose";
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
export default reviewModel;