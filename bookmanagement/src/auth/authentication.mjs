import jwt from 'jsonwebtoken';
import config from "../../config.mjs";
import bookModel from "../models/bookModel.mjs";

const authenticateToken = (req, res, next) => {
  let token = req.headers['authorization'];

  if (!token) {
    return res
      .status(401)
      .send({ message: "failed", error: "Please login to access this resource" });
  }

  token = token.split(' ')[1];

  jwt.verify(token, config.secretToken, (err, decodedToken) => {
    if (err) {
      return res
        .status(401)
        .send({ message: "failed", error: "Invalid credentials" });
    }
    req.user = decodedToken;
    next();
  });
};

const authorization = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    // Ensure this middleware is only used when a bookId is present
    if (!bookId) {
      return res
        .status(400)
        .send({ status: false, message: "Book ID is required for this operation" });
    }

    const book = await bookModel.findOne({ _id: bookId, isDeleted: false });
    if (!book) {
      return res
        .status(404)
        .send({ status: false, message: 'Book not found or already deleted' });
    }

    // Compare book owner with authenticated user id from token
    if (book.userId.toString() !== req.user?.id) {
      return res
        .status(403)
        .send({ status: false, message: 'Unauthorized access: not the book owner' });
    }

    req.book = book;
    next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

export { authenticateToken, authorization };