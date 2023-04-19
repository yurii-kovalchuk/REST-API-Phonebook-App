const express = require("express");

const {
  getAll,
  getById,
  addContact,
  deleteContact,
  updateContact,
} = require("../../controllers/contacts");

// const { schemaAllRequired, schemaNoRequired } = require("../../models/schemas");

const router = express.Router();

router.get("/", getAll);

router.get("/:contactId", getById);

router.post("/", addContact);

router.delete("/:contactId", deleteContact);

router.patch("/:contactId", updateContact);

module.exports = router;
