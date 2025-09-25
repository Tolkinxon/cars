import Joi from "joi";

const title = Joi.string().trim().required().messages({
  "string.base": "Car title must be a string",
  "string.empty": "Car title cannot be empty",
  "any.required": "Car title is required"
});

const brand = Joi.string().hex().length(24).required().messages({
  "string.base": "Brand must be a string",
  "string.empty": "Brand cannot be empty",
  "string.hex": "Brand must be a valid ObjectId",
  "string.length": "Brand must be 24 characters long",
  "any.required": "Brand is required"
});

const price = Joi.number().min(3).required().messages({
  "number.base": "Car price must be a number",
  "number.min": "Car price must be at least 3",
  "any.required": "Car price is required"
});

const gearbook = Joi.string().trim().required().messages({
  "string.base": "gearbook must be a string",
  "string.empty": "gearbook cannot be empty",
  "any.required": "gearbook is required"
});

const tinting = Joi.boolean().default(false).messages({
    "boolean.base": "Tnting must be a boolean"
});

const engine = Joi.string().trim().required().messages({
  "string.base": "engine must be a string",
  "string.empty": "engine cannot be empty",
  "any.required": "engine is required"
});

const year = Joi.number().required().messages({
  "number.base": "Date of manufacture is number",
  "any.required": "Date of manufacture is required"
});

const color = Joi.string().trim().required().messages({
  "string.base": "Color must be a string",
  "string.empty": "Color cannot be empty",
  "any.required": "Color is required"
});

const distance = Joi.number().min(3).required().messages({  
  "number.base": "Car price must be a number",
  "number.min": "Car price must be at least 3",
  "any.required": "Car price is required"
});

const description = Joi.string().trim().min(20).required().messages({
  "string.base": "Car description must be a string",
  "string.empty": "Car description cannot be empty",
  "string.min": "Car description must be at least 20 characters long",
  "any.required": "Car description is required"
});

const brand_image = Joi.string().uri().allow('').messages({
  "string.base": "Car brand image must be a string",
  "string.empty": "Car brand image cannot be empty",
  "string.uri": "Car brand image must be a valid URL",
  "any.required": "Car brand image is required"
});

const inner_image = Joi.string().uri().allow('').messages({
  "string.base": "Car inner image must be a string",
  "string.empty": "Car inner image cannot be empty",
  "string.uri": "Car inner image must be a valid URL",
  "any.required": "Car inner image is required"
});

const outer_image = Joi.string().uri().allow('').messages({
  "string.base": "Car outer image must be a string",
  "string.empty": "Car outer image cannot be empty",
  "string.uri": "Car outer image must be a valid URL",
  "any.required": "Car outer image is required"
});


let carSchema = Joi.object({
  title,
  brand,
  price,
  gearbook,
  tinting,
  engine,
  year,
  color,
  distance,
  description,
  brand_image,
  inner_image,
  outer_image
});

const createCarSchema = (data) => {
  const schemaFields = {};

  if ("title" in data) schemaFields.title = title;
  if ("brand" in data) schemaFields.brand = brand;
  if ("price" in data) schemaFields.price = price;
  if ("gearbook" in data) schemaFields.gearbook = gearbook;
  if ("tinting" in data) schemaFields.tinting = tinting;
  if ("engine" in data) schemaFields.engine = engine;
  if ("year" in data) schemaFields.year = year;
  if ("color" in data) schemaFields.color = color;
  if ("distance" in data) schemaFields.distance = period;
  if ("description" in data) schemaFields.description = description;
  if ("brand_image" in data) schemaFields.brand_image = brand_image;
  if ("inner_image" in data) schemaFields.inner_image = inner_image;
  if ("outer_image" in data) schemaFields.outer_image = outer_image;

  return Joi.object(schemaFields);
};

export { createCarSchema, carSchema };
