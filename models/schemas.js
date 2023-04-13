const Joi = require("joi");

const schemaAllRequired = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  phone: Joi.string()
    .pattern(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})([ .-]?)([0-9]{4,4})/, {
      name: "numbers",
    })
    .max(14)
    .required(),
});

const schemaNoRequired = Joi.object({
  name: Joi.string(),
  email: Joi.string().email({ minDomainSegments: 2 }),
  phone: Joi.string()
    .pattern(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})([ .-]?)([0-9]{4,4})/, {
      name: "numbers",
    })
    .max(14),
}).min(1);

module.exports = {
  schemaAllRequired,
  schemaNoRequired,
};
