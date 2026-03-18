import bookModel from "../models/bookModel.mjs";
import userModel from "../models/userModel.mjs";
import mongoose from "mongoose";

const createBook = async (req, res) => {
  try {
    const data = req.body;
    const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } =
      data;

    if (Object.keys(data).length === 0) {
      return res.status(400).send({
        status: false,
        message: "Request body cannot be empty",
      });
    }

    if (!title)
      return res
        .status(400)
        .send({ status: false, message: "Title is required" });
    if (!excerpt)
      return res
        .status(400)
        .send({ status: false, message: "Excerpt is required" });
    if (!userId)
      return res
        .status(400)
        .send({ status: false, message: "UserId is required" });
    if (!ISBN)
      return res
        .status(400)
        .send({ status: false, message: "ISBN is required" });
    if (!category)
      return res
        .status(400)
        .send({ status: false, message: "Category is required" });
    if (!subcategory)
      return res
        .status(400)
        .send({ status: false, message: "Subcategory is required" });
    if (!releasedAt)
      return res
        .status(400)
        .send({ status: false, message: "Released date is required" });

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(releasedAt)) {
      return res.status(400).send({
        status: false,
        message: "Released date must be in YYYY-MM-DD format",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({
        status: false,
        message: "Invalid userId format",
      });
    }

    const userExists = await userModel.findById(userId);
    if (!userExists) {
      return res.status(400).send({
        status: false,
        message: "User does not exist",
      });
    }

    const isTitleUnique = await bookModel.findOne({ title });
    if (isTitleUnique) {
      return res
        .status(400)
        .send({ status: false, message: "Title already exists" });
    }
    const isISBNUnique = await bookModel.findOne({ ISBN });
    if (isISBNUnique) {
      return res
        .status(400)
        .send({ status: false, message: "ISBN already exists" });
    }

    const bookData = {
      title,
      excerpt,
      userId,
      ISBN,
      category,
      subcategory,
      releasedAt,
    };

    const book = await bookModel.create(bookData);

    return res.status(201).send({
      status: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

const getBooks = async (req, res) => {
  try {
    const query = req.query;
    const { userId, category, subcategory } = query;

    const filter = { isDeleted: false };
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res
          .status(400)
          .send({ status: false, message: "Invalid userId format" });
      }
      filter.userId = userId;
    }
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;

    const books = await bookModel
      .find(filter)
      .select("_id title excerpt userId category releasedAt reviews")
      .sort({ title: 1 });

    if (books.length === 0) {
      return res.status(404).send({ status: false, message: "No books found" });
    }

    return res
      .status(200)
      .send({ status: true, message: "Success", data: books });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const bookId = req.params.bookId;

    // 1. Validate bookId format
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).send({
        status: false,
        message: "Invalid book ID format",
      });
    }

    // 2. Find book by ID
    const book = await bookModel
      .findById(bookId)
      .select(
        "_id title excerpt userId category subcategory releasedAt ISBN reviews",
      );

    if (!book) {
      return res.status(404).send({
        status: false,
        message: "Book not found",
      });
    }

    // 3. Success response
    return res.status(200).send({
      status: true,
      message: "Success",
      data: book,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

const updateBookById = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const data = req.body;
    const { title, excerpt, releasedAt, ISBN } = data;

    // 1. Validate bookId format
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).send({
        status: false,
        message: "Invalid book ID format",
      });
    }

    // 2. Check if book exists and is not deleted
    const book = await bookModel.findOne({ _id: bookId, isDeleted: false });
    if (!book) {
      return res.status(404).send({
        status: false,
        message: "Book not found",
      });
    }

    // 3. Validate and check unique constraints for title
    if (title && title !== book.title) {
      const titleExists = await bookModel.findOne({
        title,
        _id: { $ne: bookId },
      });
      if (titleExists) {
        return res.status(400).send({
          status: false,
          message: "Title already exists",
        });
      }
    }

    // 4. Validate and check unique constraints for ISBN
    if (ISBN && ISBN !== book.ISBN) {
      const isbnExists = await bookModel.findOne({
        ISBN,
        _id: { $ne: bookId },
      });
      if (isbnExists) {
        return res.status(400).send({
          status: false,
          message: "ISBN already exists",
        });
      }
    }

    // 5. Validate releasedAt format if provided
    if (releasedAt) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(releasedAt)) {
        return res.status(400).send({
          status: false,
          message: "Released date must be in YYYY-MM-DD format",
        });
      }
    }

    // 6. Update book
    const updatedBook = await bookModel.findByIdAndUpdate(
      bookId,
      {
        ...(title && { title }),
        ...(excerpt && { excerpt }),
        ...(releasedAt && { releasedAt }),
        ...(ISBN && { ISBN }),
      },
      { new: true },
    );

    // 7. Success response
    return res.status(200).send({
      status: true,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.bookId;

    // 1. Validate bookId format
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).send({
        status: false,
        message: "Invalid book ID format",
      });
    }

    // 2. Check if book exists and is not deleted
    const book = await bookModel.findOne({ _id: bookId, isDeleted: false });
    if (!book) {
      return res.status(404).send({
        status: false,
        message: "Book not found",
      });
    }

    // 3. Mark book as deleted
    await bookModel.findByIdAndUpdate(
      bookId,
      { isDeleted: true },
      { new: true },
    );

    // 4. Success response
    return res.status(200).send({
      status: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};
export { createBook, getBooks, getBookById, updateBookById, deleteBook };