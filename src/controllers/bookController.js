require("dotenv").config();
const Book = require("../models/book");
const { ValidationError, NotFoundError } = require("../helper/error");
const Mongoose = require("mongoose");
//create new book and save to db
exports.createBook = async (request, response, next) => {
  try {
    const {
      isbn,
      title,
      author,
      publisher,
      publishedDate,
      genre,
      description,
      quantity,
    } = request.body;

    if (
      !isbn ||
      !title ||
      !author ||
      !publisher ||
      !publishedDate ||
      !genre ||
      !description ||
      !quantity
    ) {
      throw new ValidationError("All fields are required");
    }

    const book = new Book({
      isbn,
      title,
      author,
      publisher,
      publishedDate,
      genre,
      description,
      quantity,
    });

    const savedBook = await book.save();

    response.status(201).json({
      success: true,
      message: "Book created successfully",
      data: savedBook,
    });
  } catch (error) {
    // Ensure proper error handling
    console.error("Error creating book:", error);
    next(error); // Pass the entire error object for better error handling
  }
};
exports.updateBook = async (request, response, next) => {
  try {
    const book_id = request.params.id;

    if (!book_id) {
      throw new ValidationError("Book id is required");
    }

    if (!Mongoose.isValidObjectId(book_id)) {
      throw new ValidationError(`Invalid book id ${book_id}`);
    }

    const updatedBook = await Book.findByIdAndUpdate(
      book_id,
      request.body,
      { new: true, runValidators: true } // To ensure validators are run on update
    );

    if (!updatedBook) {
      return response.status(404).json({
        success: false,
        response_message: "Book not found",
      });
    }

    response.status(200).json({
      success: true,
      response_message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    next(error); // Pass the entire error object to the error handler
  }
};

//delete book by id
exports.deleteBook = async (request, response, next) => {
  try {
    let book_id = request.params.id;
    if (!book_id) {
      throw new ValidationError("Book id is required");
    }
    if (!mongoose.isValidObjectId(book_id)) {
      throw new ValidationError(`Invalid book id ${book_id}`);
    }
    let deletedBook = await Book.findByIdAndDelete(book_id);
    if (deletedBook) {
      response.status(200).json({
        success: true,
        response_message: "Book deleted successfully",
      });
    }
  } catch (error) {
    next(error.message);
  }
};

//search book by title,author,genre
exports.searchBook = async (request, response, next) => {
  try {
    let { title, author, genre } = request.query;

    // Construct the query object based on provided search criteria
    let query = {};
    if (title) {
      query.title = { $regex: new RegExp(`^${title}$`, "i") };
    }
    if (author) {
      query.author = { $regex: new RegExp(`^${author}$`, "i") };
    }
    if (genre) {
      query.genre = { $regex: new RegExp(`^${genre}$`, "i") };
    }

    // Check if at least one search criteria is provided
    if (!title && !author && !genre) {
      throw new ValidationError("At least one search criteria is required");
    }

    // Query the database
    let books = await Book.find(query).limit(10);

    // Handle results
    if (books.length > 0) {
      response.status(200).json({
        success: true,
        response_message: "Books found successfully",
        data: books,
      });
    } else {
      throw new NotFoundError("No books found matching the given criteria");
    }
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
};

//filter book by availablity
exports.filterByAvailability = async (request, response, next) => {
  try {
    let { available } = request.query;

    if (available === undefined) {
      throw new ValidationError("Availability status is required");
    }

    // Convert available to boolean if it's a string "true" or "false"
    available = available === "true";

    if (typeof available !== "boolean") {
      throw new ValidationError("Availability must be a boolean value");
    }

    if (!available) {
      throw new ValidationError("Availability cannot be false");
    }

    let books = await Book.find({ available });

    if (books.length > 0) {
      response.status(200).json({
        success: true,
        response_message: "Books found successfully",
        data: books,
      });
    } else {
      throw new NotFoundError("No books found matching the given criteria");
    }
  } catch (error) {
    next(error.message);
  }
};

exports.borrowBook = async (request, response, next) => {
  try {
    let book_id = request.params.id;

    if (!book_id) {
      throw new ValidationError("Book id is required");
    }

    if (!Mongoose.isValidObjectId(book_id)) {
      throw new ValidationError(`Invalid book id ${book_id}`);
    }

    // Check if user is authenticated and get user ID
    if (!request.user || !request.user._id) {
      throw new ValidationError(
        "User is not authenticated or user ID is missing"
      );
    }

    let book = await Book.findById(book_id);

    if (!book) {
      throw new NotFoundError("Book not found");
    }

    if (!book.available) {
      throw new ValidationError("Book is not available");
    }

    // Update book availability and borrowing details
    book.available = false;
    book.borrowedBy = request.user._id;
    book.dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    // Save the updated book object
    let borrowedBook = await book.save();

    response.status(200).json({ success: true, borrowedBook });
  } catch (error) {
    if (error instanceof ValidationError || error instanceof NotFoundError) {
      response.status(400).json({ success: false, message: error.message });
    } else {
      // Handle other types of errors (e.g., database errors, unexpected errors)
      response
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
};
