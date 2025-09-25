import { Schema, model } from 'mongoose';
const phoneNumberRegex = /^\+9989[012345789][0-9]{7}$/;
const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;


const userSchema = new Schema({
    first_name: {
        type: String,
        trim: true,
        required: [true, "First name is required !"],
    },
    last_name: {
        type: String,
        trim: true,
        required: [true, "Last name is required !"],
    },
    phone: {
        type: String,
        trim: true,
        unique: [true, "Phone number already exists"],
        match: [phoneNumberRegex, "Phone number is invalid !"],
        required: [true, "Phone number is required !"]
    },
    email: {
        type: String,
        trim: true,
        unique: [true, "Email already exists"],
        match: [emailRegex, "Email is invalid !"],
        required: [true, "Email is required !"]
    },
    password: {
        type: String,
        trim: true,
        minlength: [5, "Password must be at least 5 characters long"],
        required: [true, "Password is required !"]
    },
    role: {
        type: String,
        trim: true,
        default: 'user',
        enum: {
            values: ['user', 'admin'],
            message: '{VALUE} is invalid !'
        }
    },
    otp: {
        type: String,
        maxLength: [6, 'Max number length is 6']
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    otpTime: {
        type: Number,
    },
    refreshTokens: [
        {
            token: {
                type: String,
                trim: true,
                required: true,
                default: null
            },
            role: {
                type: String,
                trim: true,
                default: 'user',
                enum: {
                    values: ['user', 'admin'],
                    message: '{VALUE} is invalid !'
                }
            },
            userAgent: {
                type: String
            },
            createdAt: { type: Date,  default: Date.now() }
        }
    ]
}, {
    versionKey: false,
    timestamps: true
})

export default model('user', userSchema);