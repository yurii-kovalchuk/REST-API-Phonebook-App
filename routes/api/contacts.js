const express = require("express");

const { isValidId, authenticate } = require("../../middlewares");
const {
  getAll,
  getOneContact,
  addContact,
  deleteContact,
  updateContact,
  updateStatusContact,
} = require("../../controllers/contacts");

const router = express.Router();

router.get("/", authenticate, getAll);

router.get("/:contactId", authenticate, isValidId, getOneContact);

router.post("/", authenticate, addContact);

router.delete("/:contactId", authenticate, isValidId, deleteContact);

router.patch("/:contactId", authenticate, isValidId, updateContact);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  updateStatusContact
);

module.exports = router;
