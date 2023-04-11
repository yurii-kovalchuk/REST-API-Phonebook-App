const express = require("express");
const Joi = require("joi");

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");

const router = express.Router();

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  phone: Joi.string()
    .pattern(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})/, {
      name: "numbers",
    })
    .required(),
});

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();

    res.json(contacts);
  } catch (err) {
    next(err);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const queryContact = await getContactById(contactId);

    if (typeof queryContact === "undefined") {
      const error = new Error("Not found");
      error.status = 404;
      throw error;
    }

    res.json(queryContact);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const body = req.body;

    const { error } = schema.validate(body);
    if (error) {
      const handleError = new Error();
      error.details[0].type === "any.required"
        ? (handleError.message = "missing required name field")
        : (handleError.message = error.message);
      handleError.status = 400;
      throw handleError;
    }

    const newContact = await addContact(body);

    res.status(201).json(newContact);
  } catch (err) {
    next(err);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const deletedContact = await removeContact(contactId);

    if (!deletedContact) {
      const error = new Error("Not found");
      error.status = 404;
      throw error;
    }
    res.json({ message: "contact deleted" });
  } catch (err) {
    next(err);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const body = req.body;

    if (Object.keys(body).length === 0) {
      const error = new Error("missing fields");
      error.status = 400;
      throw error;
    }

    const updatedContact = await updateContact(contactId, body);

    if (!updatedContact) {
      const error = new Error("There is no contact with this id");
      error.status = 404;
      throw error;
    }

    res.json(updatedContact);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
