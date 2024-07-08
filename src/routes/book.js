const router = require("express").Router();
const bookRoutes = require("../controllers/bookController");
const librarianAuth = require("../authMiddleware/userAuth");

router.post("/create-book", bookRoutes.createBook);
module.exports = router;
