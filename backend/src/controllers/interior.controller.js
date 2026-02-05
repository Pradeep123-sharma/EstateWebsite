
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Interior } from "../models/interior.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createInterior = asyncHandler(async (req, res) => {
    // Assuming agents or admins can create interiors
    if (req.user.role !== "agent" && req.user.role !== "admin") {
        throw new ApiError(403, "Only agents or admins can create interior listings");
    }

    const { title, description, price, category, mobileNumber } = req.body;

    if ([title, description, price, category, mobileNumber].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    let images = [];
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const uploadedImage = await uploadOnCloudinary(file.path);
            if (uploadedImage) {
                images.push(uploadedImage.url);
            }
        }
    }

    const interior = await Interior.create({
        title,
        description,
        price,
        category,
        mobileNumber,
        images,
        agent: req.user._id
    });

    return res.status(201).json(new ApiResponse(201, interior, "Interior listing created successfully"));
});

const getAllInteriors = asyncHandler(async (req, res) => {
    const interiors = await Interior.find().populate("agent", "fullName email avatar");
    return res.status(200).json(new ApiResponse(200, interiors, "Interiors fetched successfully"));
});

const getInteriorById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const interior = await Interior.findById(id).populate("agent", "fullName email avatar");

    if (!interior) {
        throw new ApiError(404, "Interior listing not found");
    }

    return res.status(200).json(new ApiResponse(200, interior, "Interior fetched successfully"));
});

const getAgentInteriors = asyncHandler(async (req, res) => {
    const interiors = await Interior.find({ agent: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, interiors, "Agent interiors fetched successfully"));
});

const deleteInterior = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const interior = await Interior.findById(id);

    if (!interior) {
        throw new ApiError(404, "Interior listing not found");
    }

    if (interior.agent.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        throw new ApiError(403, "You are not authorized to delete this interior listing");
    }

    await Interior.findByIdAndDelete(id);

    return res.status(200).json(new ApiResponse(200, {}, "Interior listing deleted successfully"));
});

const updateInterior = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const interior = await Interior.findById(id);

    if (!interior) {
        throw new ApiError(404, "Interior listing not found");
    }

    if (interior.agent.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        throw new ApiError(403, "You are not authorized to update this interior listing");
    }

    const { title, description, price, category, mobileNumber } = req.body;

    interior.title = title || interior.title;
    interior.description = description || interior.description;
    interior.price = price || interior.price;
    interior.category = category || interior.category;
    interior.mobileNumber = mobileNumber || interior.mobileNumber;

    await interior.save();

    return res.status(200).json(new ApiResponse(200, interior, "Interior listing updated successfully"));
});

export {
    createInterior,
    getAllInteriors,
    getInteriorById,
    getAgentInteriors,
    deleteInterior,
    updateInterior
}
