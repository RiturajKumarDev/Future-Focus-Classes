const express = require("express");
const router = express.Router();
const couponController = require("../controllers/couponController");
const { authenticateUser, authorizeRole } = require("../middleware/auth");

router.post("/validate", authenticateUser, couponController.validateCoupon);
router.get("/", authenticateUser, authorizeRole("admin"), couponController.getCoupons);
router.post("/", authenticateUser, authorizeRole("admin"), couponController.createCoupon);
router.patch("/:id", authenticateUser, authorizeRole("admin"), couponController.toggleCoupon);

module.exports = router;
