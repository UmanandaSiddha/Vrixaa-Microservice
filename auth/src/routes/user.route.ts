import express from "express";
import { getUserProfile, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";

const router = express.Router();

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/logout").get(logoutUser);
router.route("/profile").get(getUserProfile);

export default router;