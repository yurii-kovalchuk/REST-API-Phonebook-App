const express = require("express");

const { listContacts } = require("../../models/contacts");

const router = express.Router();

router.get("/", async (req, res, next) => {
  listContacts()
    .then((data) => res.json(data))
    .catch((err) => next(err));
});

router.get("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.post("/", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.delete("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router;
