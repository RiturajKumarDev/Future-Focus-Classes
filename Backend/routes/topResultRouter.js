const express = require("express");
const topResultRouter = express.Router();
const { addTopper, getResults, deleteResult } = require("../controllers/topResultController");

topResultRouter.post("/save", addTopper);
topResultRouter.get("/all", getResults);
topResultRouter.delete("/:id", deleteResult);

exports.topResultRouter = topResultRouter;
