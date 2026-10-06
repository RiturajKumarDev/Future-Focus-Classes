const express = require("express");
const router = express.Router();
const certificateController = require("../controllers/certificateController");
const { authenticateUser } = require("../middleware/auth");

router.get("/my", authenticateUser, certificateController.getMyCertificates);
router.get("/verify/:certificateId", certificateController.verifyCertificate);

module.exports = router;
