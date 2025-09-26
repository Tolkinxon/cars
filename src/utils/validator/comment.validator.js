import Joi from "joi";

const commenter = Joi.string().hex().length(24).required().messages({
  "string.base": "Commenter id must be a string",
  "string.empty": "Commenter id cannot be empty",
  "string.hex": "Commenter id must be a valid ObjectId",
  "string.length": "Commenter id must be 24 characters long",
  "any.required": "Commenter id is required"
});

const car = Joi.string().hex().length(24).required().messages({
  "string.base": "Book id must be a string",
  "string.empty": "Book id cannot be empty",
  "string.hex": "Book id must be a valid ObjectId",
  "string.length": "Book id must be 24 characters long",
  "any.required": "Book id is required"
});

const comment = Joi.string().trim().min(10).required().messages({
  "string.base": "Comment must be a string",
  "string.empty": "Comment cannot be empty",
  "string.min": "Comment must be at least 10 characters long",
  "any.required": "Comment is required"
});

const isLiked = Joi.boolean().default(false).messages({
    "boolean.base": "isVerified must be a boolean"
});



let commentSchema = Joi.object({
    comment,
    commenter,
    car,
    isLiked
});

const createCommentSchema = (data) => {
  const schemaFields = {};

  if ("commenter" in data) schemaFields.commenter = commenter;
  if ("comment" in data) schemaFields.comment = comment;
  if ("car" in data) schemaFields.car = car;
  if ("isLiked" in data) schemaFields.isLiked = isLiked;

  return Joi.object(schemaFields);
};

export { createCommentSchema, commentSchema };
