
import mongoose, { Schema } from "mongoose";

const interiorSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        mobileNumber: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        images: [
            {
                type: String // cloudinary url
            }
        ],
        category: {
            type: String,
            required: true
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

export const Interior = mongoose.model("Interior", interiorSchema)
