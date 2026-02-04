
import { Router } from "express";
import {
    addToWishlist,
    removeFromWishlist,
    getUserWishlist
} from "../controllers/wishlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // All wishlist routes require auth

router.route("/")
    .get(getUserWishlist)
    .post(addToWishlist);

router.route("/:propertyId")
    .delete(removeFromWishlist);

export default router;
