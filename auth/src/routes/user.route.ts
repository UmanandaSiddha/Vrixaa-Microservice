import express from "express";
import { getUserProfile, loginUser, logoutUser, refreshToken, registerUser } from "../controllers/user.controller.js";
import { isAuthenticatedUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/logout").get(isAuthenticatedUser, logoutUser);
router.route("/profile").get(isAuthenticatedUser, getUserProfile);
router.route("/refresh").get(refreshToken);

export default router;