import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Category name is required !"],
        set: (val) => val.toLowerCase(),
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

categorySchema.statics.findByName = function(val){
    return this.find({name: new RegExp(val, 'gi')});
};

categorySchema.query.searchName = function(val){
    return this.where({name: new RegExp(val, 'gi')});
};

export default model("category", categorySchema);