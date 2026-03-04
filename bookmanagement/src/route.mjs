import express from 'express';
const router = express.Router();
import { registerUser, login } from './controllers/userController.mjs';
import { createBook, getBooks, getBookById, updateBookById, deleteBook } from './controllers/bookController.mjs';
import { authenticateToken, authorization } from './auth/authentication.mjs';
import { createReview,updateReview,deleteReview,} from './controllers/reviewController.mjs';

router.post('/register', registerUser);
router.post('/login', login);
router.post('/books', authenticateToken, createBook);
router.get('/books', authenticateToken, getBooks);
router.get('/books/:bookId', authenticateToken, authorization, getBookById);
router.put('/books/:bookId', authenticateToken, authorization, updateBookById);
router.delete('/books/:bookId', authenticateToken, authorization, deleteBook);
router.post('/books/:bookId/review', authenticateToken, createReview);
router.put('/books/:bookId/review/:reviewId', authenticateToken, updateReview);
router.delete('/books/:bookId/review/:reviewId', authenticateToken, deleteReview);

export default router;