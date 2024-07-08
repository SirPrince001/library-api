require("dotenv").config();
const Book = require("../models/book");
const { ValidationError, NotFoundError } = require("../helper/error");
//create new book and save to db
exports.createBook = async (request, response, next) => {
  try {
    let { isbn, title, author, pulisher, genre, description, language } =
      request.body;
    if (
      !isbn ||
      !title ||
      !author ||
      !pulisher ||
      !genre ||
      !category ||
      !description ||
      !language
    ) {
      throw new ValidationError("All fields are required");
    }
    let book = new Book({
      isbn,
      title,
      author,
      pulisher,
      genre,
      description,
      language,
    });
    book = await book.save();
    response.status(201).json({
      success: true,
      response_message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    next(error.message);
  }
};

//update book by id
exports.updateBook = async(request, response , next)=>{
  try {
    let book_id = request.params.id;
    if(!book_id){
      throw new ValidationError("Book id is required");
    }
    if(!mongoose.isValidObjectId(book_id)){
      throw new ValidationError(`Invalid book id ${book_id}`);
    }
    let updatedBook = await Book.findByIdAndUpdate(
      { _id: book_id,...request.body },
      { new: true }
    );
    if(updatedBook){
      response.status(200).json({
        success: true,
        response_message: "Book updated successfully",
        data: updatedBook,
      });
    }
  } catch (error) {
    next(error.message);
  }
}

//delete book by id
exports.deleteBook = async(request, response , next)=>{
  try {
    let book_id = request.params.id;
    if(!book_id){
      throw new ValidationError("Book id is required");
    }
    if(!mongoose.isValidObjectId(book_id)){
      throw new ValidationError(`Invalid book id ${book_id}`);
    }
    let deletedBook = await Book.findByIdAndDelete(book_id);
    if(deletedBook){
      response.status(200).json({
        success: true,
        response_message: "Book deleted successfully",
      });
    }
  } catch (error) {
    next(error.message);
  }
}

//search book by title,author,genre
exports.searchBook = async(request, response , next)=>{
  try {
    let { title, author, genre } = request.query;
    if(!title &&!author &&!genre){
      throw new ValidationError("At least one search criteria is required");
    }
    let books = await Book.find({
      $or: [{ title: new RegExp(title, 'i') }, { author: new RegExp(author, 'i') }, { genre: new RegExp(genre, 'i') }],
    });
    if(books.length>0){
      response.status(200).json({
        success: true,
        response_message: "Books found successfully",
        data: books,
      });
    }else{
      throw new NotFoundError("No books found matching the given criteria");
    }
  } catch (error) {
    next(error.message);
  }
}

//filter book by availablity
exports.filterByAvailability = async(request, response , next)=>{
  try {
    let { available } = request.query;
    if(!available){
      throw new ValidationError("Availability status is required");
    }
    let books = await Book.find({ available: available === "true" });
    if(books.length>0){
      response.status(200).json({
        success: true,
        response_message: "Books found successfully",
        data: books,
      });
    }else{
      throw new NotFoundError("No books found matching the given criteria");
    }
  } catch (error) {
    next(error.message);
  }
}

//borrow book if available
exports.borrowBook = async(request, response , next)=>{
  try {
    let book_id = request.params.id;
    if(!book_id){
      throw new ValidationError("Book id is required");
    }
    if(!mongoose.isValidObjectId(book_id)){
      throw new ValidationError(`Invalid book id ${book_id}`);
    }
    let book = await Book.findById(book_id);
    if(!book){
      throw new NotFoundError("Book not found");
    }
    if(!book.available){
      throw new ValidationError("Book is not available");
    }
    book.available = false;
    book.borrowedBy = request.user._id;
    book.dueDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await book.save();
    response.status(200).json({})

  }