
import { Router } from "express";
import {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    getAgentProperties
} from "../controllers/property.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/")
    .get(getAllProperties)
    .post(verifyJWT, upload.array("photos", 10), createProperty);

router.route("/agent-properties").get(verifyJWT, getAgentProperties);

router.route("/:id")
    .get(getPropertyById)
    .patch(verifyJWT, updateProperty)
    .delete(verifyJWT, deleteProperty);

export default router;
