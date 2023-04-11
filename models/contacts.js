const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const contacts = await fs.readFile(contactsPath, "utf8");
  return JSON.parse(contacts);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();

  return contacts.find((contact) => contact.id === contactId);
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();

  const idx = contacts.findIndex((contact) => contact.id === contactId);

  if (idx === -1) {
    return null;
  }

  const [deletedContact] = contacts.splice(idx, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts), "utf8");

  return deletedContact;
};

const addContact = async (body) => {
  const contacts = await listContacts();

  const newContact = { id: nanoid(21), ...body };
  contacts.push(newContact);

  await fs.writeFile(contactsPath, JSON.stringify(contacts), "utf8");

  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();

  const idx = contacts.findIndex((contact) => contact.id === contactId);

  if (idx === -1) {
    return null;
  }

  contacts[idx] = { id: contactId, ...body };
  await fs.writeFile(contactsPath, JSON.stringify(contacts), "utf8");

  return contacts[idx];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
