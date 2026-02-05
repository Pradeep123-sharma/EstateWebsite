
import { Router } from "express";
import {
    createInterior,
    getAllInteriors,
    getInteriorById,
    getAgentInteriors,
    deleteInterior,
    updateInterior
} from "../controllers/interior.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/")
    .get(getAllInteriors)
    .post(verifyJWT, upload.array("images", 10), createInterior);

router.route("/agent-interiors").get(verifyJWT, getAgentInteriors);

router.route("/:id")
    .get(getInteriorById)
    .delete(verifyJWT, deleteInterior)
    .patch(verifyJWT, updateInterior);

export default router;
