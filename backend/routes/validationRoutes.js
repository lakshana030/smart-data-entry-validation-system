const express = require("express");
const router = express.Router();

// Import controller functions
const {
  createEntry,
  getEntries,
  getEntryById,
  updateEntry,
  deleteEntry
} = require("../controllers/validationController");

/*
    RESTful Routes
    Base URL: /api/validation
*/

// CREATE new data entry
router.post("/", createEntry);

// GET all entries
router.get("/", getEntries);

// GET single entry by ID
router.get("/:id", getEntryById);

// UPDATE entry by ID
router.put("/:id", updateEntry);

// DELETE entry by ID
router.delete("/:id", deleteEntry);

module.exports = router;
