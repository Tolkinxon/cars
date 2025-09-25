import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Category name is required !"],
        set: (val) => val.toUpperCase(),
        validate: {
            validator(val) {
                return val !== null && val !== ""
            },
            message: "Category name cannot be null or empty!"
        }
    }
}, {
    versionKey: false,
    timestamps: true
});

export default model("category", categorySchema);