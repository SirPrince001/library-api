const router = require("express").Router();
const bookRoutes = require("../controllers/bookController");
const librarianAuth = require("../authMiddleware/userAuth");

router.post("/create-book", librarianAuth, bookRoutes.createBook);
router.put("/update-book/:id", librarianAuth, bookRoutes.updateBook);
router.delete("/delete-book/:id", librarianAuth, bookRoutes.deleteBook);
router.get("/search-books", bookRoutes.searchBook);
router.get("/filter-books", bookRoutes.filterByAvailability);
router.put("/borrow-book/:id", bookRoutes.borrowBook);
module.exports = router;
