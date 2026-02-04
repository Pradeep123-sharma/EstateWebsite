
import mongoose, { Schema } from "mongoose";

const propertySchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        mobileNumber: {
            type: String,
            required: true
        },
        propertyType: {
            type: String,
            enum: ["apartment", "house", "commercial", "land"],
            required: true
        },
        status: {
            type: String,
            enum: ["available", "sold", "rented"],
            default: "available"
        },
        photos: [
            {
                type: String // cloudinary url
            }
        ],
        features: [
            {
                type: String
            }
        ],
        bedrooms: {
            type: Number,
            default: 0
        },
        bathrooms: {
            type: Number,
            default: 0
        },
        area: {
            type: Number,
            default: 0
        },
        agent: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)

export const Property = mongoose.model("Property", propertySchema)
