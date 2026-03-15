import express from 'express';
<<<<<<< HEAD
const router = express.Router();
import { registerUser, login } from './controllers/userController.mjs';
import { createBook, getBooks, getBookById, updateBookById, deleteBook } from './controllers/bookController.mjs';
import { authenticateToken, authorization } from './auth/authentication.mjs';
import { createReview, updateReview, deleteReview } from './controllers/reviewController.mjs';
import upload from './middlewares/upload.mjs';

router.post('/register', registerUser);
router.post('/login', login);

// Create book with optional imageCover file
router.post('/books', authenticateToken, upload.single('imageCover'), createBook);

router.get('/books', authenticateToken, getBooks);
router.get('/books/:bookId', authenticateToken, authorization, getBookById);
router.put('/books/:bookId', authenticateToken, authorization, updateBookById);
router.delete('/books/:bookId', authenticateToken, authorization, deleteBook);

router.post('/books/:bookId/review', authenticateToken, createReview);
router.put('/books/:bookId/review/:reviewId', authenticateToken, updateReview);
router.delete('/books/:bookId/review/:reviewId', authenticateToken, deleteReview);

=======
import { createUser,loginUser } from './controllers/userController.mjs';
import { createBook,getBooks,getBookById,updateBook,deleteBook } from './controllers/bookController.mjs';
import { createReview,updateReview,deleteReview } from './controllers/reviewController.mjs';
import {authentication,authorisation} from './auth/authentication.mjs';
const router= express.Router();
router.get('/',(req,res)=>{
    return res.status(200).send({message:'ok'})
})
router.post('/register',createUser);
router.post('/login',loginUser);
router.post('/books',authentication,createBook);
router.get('/books',authentication,getBooks);
router.get('/books/:bookId',authentication,getBookById);
router.put('/books/:bookId',authentication,authorisation,updateBook);
router.delete('/books/:bookId',authentication,authorisation,deleteBook);
router.post('/books/:bookId/review',authentication,createReview);
router.put('/books/:bookId/review/:reviewId',authentication,authorisation,updateReview);
router.delete('/books/:bookId/review/:reviewId',authentication,authorisation,deleteReview);
>>>>>>> c4e10ef7b9c7a28a59d3b0716b7dc53d28d98020
export default router;