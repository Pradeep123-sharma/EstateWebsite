
import mongoose, { Schema } from "mongoose";

const wishlistSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        property: {
            type: Schema.Types.ObjectId,
            ref: "Property"
        }
    },
    {
        timestamps: true
    }
)

export const Wishlist = mongoose.model("Wishlist", wishlistSchema)
