
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Wishlist } from "../models/wishlist.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addToWishlist = asyncHandler(async (req, res) => {
    const { propertyId } = req.body;

    if (!propertyId) {
        throw new ApiError(400, "Property ID is required");
    }

    const existingItem = await Wishlist.findOne({
        user: req.user._id,
        property: propertyId
    });

    if (existingItem) {
        return res.status(200).json(new ApiResponse(200, existingItem, "Property already in wishlist"));
    }

    const wishlistItem = await Wishlist.create({
        user: req.user._id,
        property: propertyId
    });

    return res.status(201).json(new ApiResponse(201, wishlistItem, "Property added to wishlist"));
});

const removeFromWishlist = asyncHandler(async (req, res) => {
    const { propertyId } = req.params;

    // Assuming we pass propertyId in params to remove. 
    // Or we could pass wishlistId. Usually removing by propertyId from user's wishlist is more intuitive for "toggle" behavior on frontend.
    // Let's support propertyId in params. 

    const deletedItem = await Wishlist.findOneAndDelete({
        user: req.user._id,
        property: propertyId
    });

    if (!deletedItem) {
        throw new ApiError(404, "Property not found in wishlist");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Property removed from wishlist"));
});

const getUserWishlist = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.find({ user: req.user._id }).populate("property");

    return res.status(200).json(new ApiResponse(200, wishlist, "Wishlist fetched successfully"));
});

export {
    addToWishlist,
    removeFromWishlist,
    getUserWishlist
}
