const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");
const { authenticateUser } = require("../middleware/auth");

router.get("/", authenticateUser, wishlistController.getWishlist);
router.post("/toggle/:courseId", authenticateUser, wishlistController.toggleWishlist);
router.get("/check/:courseId", authenticateUser, wishlistController.checkWishlist);

module.exports = router;
