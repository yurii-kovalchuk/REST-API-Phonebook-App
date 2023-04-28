const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../utils");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      required: [true, "Set email for contact"],
    },
    phone: {
      type: String,
      match: /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})$/,
      required: [true, "Set phone for contact"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false }
);

contactSchema.post("save", handleMongooseError);

const schemaAllRequired = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  phone: Joi.string()
    .pattern(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})([ .-]?)([0-9]{4,4})/, {
      name: "numbers",
    })
    .max(14)
    .required(),
  favorite: Joi.boolean(),
});

const schemaNoRequired = Joi.object({
  name: Joi.string(),
  email: Joi.string().email({ minDomainSegments: 2 }),
  phone: Joi.string()
    .pattern(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})([ .-]?)([0-9]{4,4})/, {
      name: "numbers",
    })
    .max(14),
  favorite: Joi.boolean(),
}).min(1);

const schemaForFavorite = Joi.object({
  favorite: Joi.boolean().required(),
});

const Contact = model("contacts", contactSchema);

module.exports = {
  Contact,
  schemaAllRequired,
  schemaNoRequired,
  schemaForFavorite,
};
