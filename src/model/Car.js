import { Schema, model } from "mongoose";

const bookSchema = new Schema(
    {
        title: {
            type: String,
            trim: true,
            set: val => val.toLowerCase(),
            required: [true, 'Car title is required !'],
        },
        brand: {
            type: Schema.Types.ObjectId,
            ref: "category",
            required: [true, 'Car brand is required !']
        },
        price: {
            type: Number,
            required: [true, 'Price of car is required !']
        },
        gearbook: {
            type: String,
            trim: true,
            required: [true, 'Gearbook is required !'],
        },
        tinting: {
            type: Boolean,
            default: false,
        },
        engine: {
            type: String,
            trim: true,
            required: [true, 'Engine number is required !']
        },
        year: {
            type: Number,
            required: [true, 'Date of manufacture is required !']
        },
        color: {
            type: String,
            trim: true,
            required: [true, "Car's color is required !"]
        },
        distance: {
            type: Number,
            required: [true, 'Car distance is required !']
        },
        description: {
            type: String,
            trim: true,
            minlength: [20, 'Description must be at least 20 characters long'],
            required: [true, 'Car description is required !']
        },
        brand_image: {
            secure_url: {
                type: String,
                trim: true,
                default: null
            },
            public_id: {
                type: String,
                trim: true,
                default: null
            }
        },
        inner_image: {
            secure_url: {
                type: String,
                trim: true,
                default: null
            },
            public_id: {
                type: String,
                trim: true,
                default: null
            }
        },
        outer_image: {
            secure_url: {
                type: String,
                trim: true,
                default: null
            },
            public_id: {
                type: String,
                trim: true,
                default: null
            }
        },

    }, {
    versionKey: false,
    timestamps: true
})

bookSchema.index({ title: 'text' });

export default model('book', bookSchema);