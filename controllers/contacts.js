const { isValidObjectId } = require("mongoose");

const {
  Contact,
  schemaAllRequired,
  schemaNoRequired,
  schemaForFavorite,
} = require("../models/contact");

const { funcShell } = require("../utils");

const getAll = async (_, res) => {
  const contacts = await Contact.find();

  res.json(contacts);
};

const getOneContact = async (req, res) => {
  const { contactId } = req.params;

  const queryContact = await Contact.findById(contactId);

  if (queryContact === null) {
    const error = new Error("Not found");
    error.status = 404;
    throw error;
  }

  res.json(queryContact);
};

const addContact = async (req, res) => {
  const { body } = req;

  const { error } = schemaAllRequired.validate(body);
  if (error) {
    const handleError = new Error();
    error.details[0].type === "any.required"
      ? (handleError.message = "missing required field")
      : (handleError.message = error.message);
    handleError.status = 400;
    throw handleError;
  }

  const newContact = await Contact.create(body);

  res.status(201).json(newContact);
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;

  const deletedContact = await Contact.findByIdAndRemove(contactId);

  if (!deletedContact) {
    const error = new Error("Not found");
    error.status = 404;
    throw error;
  }
  res.json({ message: "contact deleted" });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const body = req.body;

  const { error } = schemaNoRequired.validate(body);
  if (error) {
    const handleError = new Error();
    error.details[0].type === "object.min"
      ? (handleError.message = "missing fields")
      : (handleError.message = error.message);
    handleError.status = 400;
    throw handleError;
  }

  if (!isValidObjectId(contactId)) {
    const error = new Error("Id is not valid");
    error.status = 404;
    throw error;
  }

  const updatedContact = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });

  if (!updatedContact) {
    const error = new Error("There is no contact with this id");
    error.status = 404;
    throw error;
  }

  res.json(updatedContact);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const body = req.body;

  const { error } = schemaForFavorite.validate(body);
  if (error) {
    const handleError = new Error();
    error.details[0].type === "object.min"
      ? (handleError.message = "missing field favorite")
      : (handleError.message = error.message);
    handleError.status = 400;
    throw handleError;
  }

  if (!isValidObjectId(contactId)) {
    const error = new Error("Id is not valid");
    error.status = 404;
    throw error;
  }

  const updatedContact = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });

  if (!updatedContact) {
    const error = new Error("Not found");
    error.status = 404;
    throw error;
  }

  res.json(updatedContact);
};

module.exports = {
  getAll: funcShell(getAll),
  getOneContact: funcShell(getOneContact),
  addContact: funcShell(addContact),
  deleteContact: funcShell(deleteContact),
  updateContact: funcShell(updateContact),
  updateStatusContact: funcShell(updateStatusContact),
};
