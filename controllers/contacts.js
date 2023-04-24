const {
  Contact,
  schemaAllRequired,
  schemaNoRequired,
  schemaForFavorite,
} = require("../models/contact");
const { funcShell, HandleError } = require("../utils");

const getAll = async (_, res) => {
  const contacts = await Contact.find();

  res.json(contacts);
};

const getOneContact = async (req, res) => {
  const { contactId } = req.params;

  const queryContact = await Contact.findById(contactId);

  if (queryContact === null) {
    throw HandleError(404, "Not found");
  }

  res.json(queryContact);
};

const addContact = async (req, res) => {
  const { body } = req;

  const { error } = schemaAllRequired.validate(body);
  if (error) {
    const message =
      error.details[0].type === "any.required"
        ? "missing required field"
        : error.message;
    throw HandleError(400, message);
  }

  const newContact = await Contact.create(body);

  res.status(201).json(newContact);
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;

  const deletedContact = await Contact.findByIdAndRemove(contactId);

  if (!deletedContact) {
    throw HandleError(404, "Not found");
  }

  res.json({ message: "contact deleted" });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const body = req.body;

  const { error } = schemaNoRequired.validate(body);
  if (error) {
    const message =
      error.details[0].type === "object.min" ? "missing fields" : error.message;
    throw HandleError(400, message);
  }

  const updatedContact = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });

  if (!updatedContact) {
    throw HandleError(404, "Not found");
  }

  res.json(updatedContact);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const body = req.body;

  const { error } = schemaForFavorite.validate(body);
  if (error) {
    const message =
      error.details[0].type === "object.min"
        ? "missing field favorite"
        : error.message;
    throw HandleError(400, message);
  }

  const updatedContact = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });

  if (!updatedContact) {
    throw HandleError(404, "Not found");
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
