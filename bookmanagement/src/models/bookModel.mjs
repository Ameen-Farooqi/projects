import mongoose from "mongoose";
import { reviewSchema } from "./reviewModel.mjs";
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    excerpt: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Links to your User model
    },
    ISBN: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    subcategory: {
        type: String,
        required: true,
        trim: true
    },
    reviews: {
        type: Number,
        default: 0
        // Comment: Holds number of reviews of this book
    },
    imageCover: {
        type: String,
        trim: true
        // Comment: Stores public URL of the book cover image
    },
    reviewsData : {
      type : [reviewSchema],
      default : []
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    releasedAt: {
        type: Date,
        required: true
        // Expected format: "YYYY-MM-DD"
    }
}, { timestamps: true });

const bookModel = mongoose.model('Book', bookSchema);
export default bookModel;