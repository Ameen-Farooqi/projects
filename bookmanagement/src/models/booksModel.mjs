import mongoose from "mongoose";
const booksSchema= new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    bookCover: { type: String },
    excerpt: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    ISBN: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    subcategory: { type:String, required: true },
    reviews: { type: Number, default: 0 },
    deletedAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
    releasedAt: { type: Date, required: true },
},{timestamps:true})
const booksModel= mongoose.model('books',booksSchema);
export default booksModel;
