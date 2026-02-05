
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Property } from "../models/property.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createProperty = asyncHandler(async (req, res) => {
    // Check if user is agent or admin
    if (req.user.role !== "agent" && req.user.role !== "admin") {
        throw new ApiError(403, "Only agents or admins can create properties");
    }

    const { title, description, price, location, propertyType, status, features, bedrooms, bathrooms, area, mobileNumber } = req.body;

    if ([title, description, price, location, propertyType, mobileNumber].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    let photos = [];
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const uploadedPhoto = await uploadOnCloudinary(file.path);
            if (uploadedPhoto) {
                photos.push(uploadedPhoto.url);
            }
        }
    }

    const property = await Property.create({
        title,
        description,
        price,
        location,
        propertyType,
        status: status || "available",
        photos,
        bedrooms: bedrooms || 0,
        bathrooms: bathrooms || 0,
        area: area || 0,
        mobileNumber,
        agent: req.user._id,
        features: Array.isArray(features) ? features : features ? [features] : [] // handle if string or array
    });

    return res.status(201).json(new ApiResponse(201, property, "Property created successfully"));
});

const getAllProperties = asyncHandler(async (req, res) => {
    // Basic pagination and filtering can be added later
    const properties = await Property.find().populate("agent", "fullName email avatar");
    return res.status(200).json(new ApiResponse(200, properties, "Properties fetched successfully"));
});

const getPropertyById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const property = await Property.findById(id).populate("agent", "fullName email avatar");

    if (!property) {
        throw new ApiError(404, "Property not found");
    }

    return res.status(200).json(new ApiResponse(200, property, "Property fetched successfully"));
});

const updateProperty = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
        throw new ApiError(404, "Property not found");
    }

    // Check ownership
    if (property.agent.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        throw new ApiError(403, "You are not authorized to update this property");
    }

    const { title, description, price, location, propertyType, status, features, bedrooms, bathrooms, area, mobileNumber } = req.body;

    // TODO: Handle photo updates (add/remove) - simplified for now just text fields

    property.title = title || property.title;
    property.description = description || property.description;
    property.price = price || property.price;
    property.location = location || property.location;
    property.propertyType = propertyType || property.propertyType;
    property.status = status || property.status;
    property.bedrooms = bedrooms || property.bedrooms;
    property.bathrooms = bathrooms || property.bathrooms;
    property.area = area || property.area;
    property.mobileNumber = mobileNumber || property.mobileNumber;
    if (features) property.features = Array.isArray(features) ? features : [features];

    await property.save();

    return res.status(200).json(new ApiResponse(200, property, "Property updated successfully"));
});

const deleteProperty = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
        throw new ApiError(404, "Property not found");
    }

    if (property.agent.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        throw new ApiError(403, "You are not authorized to delete this property");
    }

    await Property.findByIdAndDelete(id);

    return res.status(200).json(new ApiResponse(200, {}, "Property deleted successfully"));
});

const getAgentProperties = asyncHandler(async (req, res) => {
    const properties = await Property.find({ agent: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, properties, "Agent properties fetched successfully"));
});

export {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    getAgentProperties
}
