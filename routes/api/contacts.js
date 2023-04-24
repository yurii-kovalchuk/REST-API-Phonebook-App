const express = require("express");

const { isValidId } = require("../../middlewares");
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

router.get("/:contactId", isValidId, getOneContact);

router.post("/", addContact);

router.delete("/:contactId", isValidId, deleteContact);

router.patch("/:contactId", isValidId, updateContact);

router.patch("/:contactId/favorite", isValidId, updateStatusContact);

module.exports = router;
