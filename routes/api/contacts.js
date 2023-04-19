const express = require("express");

const {
  getAll,
  getOneContact,
  addContact,
  deleteContact,
  updateContact,
  updateStatusContact,
} = require("../../controllers/contacts");

const router = express.Router();

router.get("/", getAll);

router.get("/:contactId", getOneContact);

router.post("/", addContact);

router.delete("/:contactId", deleteContact);

router.patch("/:contactId", updateContact);

router.patch("/:contactId/favorite", updateStatusContact);

module.exports = router;
