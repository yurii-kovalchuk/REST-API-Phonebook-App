const express = require("express");

const {
  getAll,
  getOneContact,
  addContact,
  deleteContact,
  updateContact,
  updateFavoritesField,
} = require("../../controllers/contacts");

// const { schemaAllRequired, schemaNoRequired } = require("../../models/schemas");

const router = express.Router();

router.get("/", getAll);

router.get("/:contactId", getOneContact);

router.post("/", addContact);

router.delete("/:contactId", deleteContact);

router.patch("/:contactId", updateContact);

router.patch("/:contactId/favorite", updateFavoritesField);

module.exports = router;
