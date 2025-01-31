const {
  Contact,
  schemaAllRequired,
  schemaNoRequired,
  schemaForFavorite,
} = require("../models/contact");
const { funcShell, HandleError } = require("../utils");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { favorite = null, page = 1, limit = 5 } = req.query;

  const skip = (page - 1) * limit;
  const favoriteKey = favorite !== null ? "favorite" : null;

  const contacts = await Contact.find(
    { owner, [favoriteKey]: favorite },
    null,
    { skip, limit }
  );

  res.json(contacts);
};

const getOneContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId: _id } = req.params;

  const queryContact = await Contact.findOne({ _id, owner });

  if (queryContact === null) {
    throw HandleError(404);
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

  const { _id: owner } = req.user;

  const newContact = await Contact.create({ ...body, owner });

  res.status(201).json(newContact);
};

const deleteContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId: _id } = req.params;

  const deletedContact = await Contact.findOneAndRemove({ _id, owner });

  if (!deletedContact) {
    throw HandleError(404);
  }

  res.json({ message: "contact deleted" });
};

const updateContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId: _id } = req.params;
  const body = req.body;

  const { error } = schemaNoRequired.validate(body);
  if (error) {
    const message =
      error.details[0].type === "object.min" ? "missing fields" : error.message;
    throw HandleError(400, message);
  }

  const updatedContact = await Contact.findOneAndUpdate({ _id, owner }, body, {
    new: true,
  });

  if (!updatedContact) {
    throw HandleError(404);
  }

  res.json(updatedContact);
};

const updateStatusContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId: _id } = req.params;
  const body = req.body;

  const { error } = schemaForFavorite.validate(body);
  if (error) {
    const message =
      error.details[0].type === "object.min"
        ? "missing field favorite"
        : error.message;
    throw HandleError(400, message);
  }

  const updatedContact = await Contact.findByIdAndUpdate({ _id, owner }, body, {
    new: true,
  });

  if (!updatedContact) {
    throw HandleError(404);
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
