import mongoose from "mongoose";
const reviewSchema= new mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'books', required: true },
    reviewedBy: { type: String, required: true, default: 'Guest' },
    reviewedAt: { type: Date, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String },
    isDeleted: { type: Boolean, default: false },
},{timestamps:true})
const reviewModel= mongoose.model('reviews',reviewSchema);
export default reviewModel;