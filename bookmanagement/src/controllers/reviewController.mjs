import mongoose from "mongoose";
import bookModel from "../models/bookModel.mjs";
import reviewModel from "../models/reviewModel.mjs";

// small helper to check if an id looks like a Mongo ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /books/:bookId/review
const createReview = async (req, res) => {

  try {
    const { bookId } = req.params;
    const { reviewedBy, rating, review } = req.body;

    const book = await bookModel.findOne({ _id: bookId, isDeleted: false });
    if (!book) {
      return res
        .status(404)
        .send({
            status: false,
            message: "Book not found"
          });
    }

    if (!rating) {
      return res
        .status(400)
        .send({ status: false, message: "Rating is required" });
    }


    

    // Create review in reviews collection
    

    const reviewData = {
      bookId,
      reviewedBy: reviewedBy ? reviewedBy.trim() : "Guest",
      reviewedAt: new Date(),
      rating,
      review: review,
    };

    const savedReview = await reviewModel.create(reviewData);
    
    // Update book: push review to reviewsData and increment reviews count
    const updatedBook = await bookModel.findByIdAndUpdate(bookId, { $push: { reviewsData: { ...reviewData, _id: savedReview._id } }, $inc: { reviews: 1 } }, { new: true });
    
    return res.status(201).send({
      status: true,
      message: "Review added successfully",
      data: updatedBook,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

// PUT /books/:bookId/review/:reviewId
const updateReview = async (req, res) => {
  try {
    const { bookId, reviewId } = req.params;
    const { reviewedBy, rating, review } = req.body;

    // 2. check that book exists and is not deleted
    const book = await bookModel.findOne({ _id: bookId, isDeleted: false });
    if (!book) {
      return res
        .status(404)
        .send({ status: false, message: "Book not found" });
    }

    const reviewDoc = await reviewModel.findOne({ _id: reviewId, bookId: bookId, isDeleted: false });
  
    
    if (!reviewDoc) {
      return res
        .status(404)
        .send({ status: false, message: "Review not found" });
    }

    // 4. update fields if provided
    if (reviewedBy) {
      reviewDoc.reviewedBy =
        reviewedBy ? reviewedBy.trim() : reviewDoc.reviewedBy;
    }

    if (rating) {
      reviewDoc.rating = rating;
    }

    if (review) {
      reviewDoc.review = review ? review.trim() : reviewDoc.review;
    }

    reviewDoc.reviewedAt = new Date();
    await reviewDoc.save();

    const updatedBook = await bookModel.findOneAndUpdate(
      { _id: bookId, "reviewsData._id": reviewId },
      {
        $set: {
          "reviewsData.$.reviewedBy": reviewDoc.reviewedBy,
          "reviewsData.$.rating": reviewDoc.rating,
          "reviewsData.$.review": reviewDoc.review,
          "reviewsData.$.reviewedAt": reviewDoc.reviewedAt,
        },
      },
      { new: true }
    );
   
    return res.status(200).send({
      status: true,
      message: "Review updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

// DELETE /books/:bookId/review/:reviewId
const deleteReview = async (req, res) => {
  try {
    const { bookId, reviewId } = req.params;

    // 2. check that book exists and is not deleted
    const book = await bookModel.findOne({ _id: bookId, isDeleted: false });
    if (!book) {
      return res
        .status(404)
        .send({ status: false, message: "Book not found" });
    }

    // 3. check that review exists and belongs to this book
    const reviewDoc = await reviewModel.findOne({ _id: reviewId, bookId: bookId, isDeleted: false });

    if (!reviewDoc) {
      return res
        .status(404)
        .send({ status: false, message: "Review not found" });
    }

    // 4. soft delete review
    reviewDoc.isDeleted = true;
    await reviewDoc.save();

    //decrease book review count
    if (book.reviews && book.reviews > 0) {
      book.reviews = book.reviews - 1;
      await book.save();
    }
    const updateQuery = { $pull: { reviewsData: { _id: reviewId } } };
    if (book.reviews > 0) updateQuery.$inc = { reviews: -1 };
    await bookModel.findByIdAndUpdate(bookId, updateQuery);

    return res.status(200).send({
      status: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

export { createReview, updateReview, deleteReview };