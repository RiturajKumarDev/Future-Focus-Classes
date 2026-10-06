const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { authenticateUser, authorizeRole } = require("../middleware/auth");

router.get("/", categoryController.getCategories);
router.post("/", authenticateUser, authorizeRole("admin"), categoryController.createCategory);
router.put("/:id", authenticateUser, authorizeRole("admin"), categoryController.updateCategory);
router.delete("/:id", authenticateUser, authorizeRole("admin"), categoryController.deleteCategory);

module.exports = router;
