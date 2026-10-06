const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { authenticateUser, authorizeRole } = require("../middleware/auth");

router.post("/create-order", authenticateUser, paymentController.createOrder);
router.post("/verify", authenticateUser, paymentController.verifyPayment);
router.get("/", authenticateUser, authorizeRole("admin"), paymentController.getAllPayments);

module.exports = router;
