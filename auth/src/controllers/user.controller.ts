import { NextFunction, Request, Response } from "express";
import User, { UserRole } from "../models/user.model.js";
import { StatusCodes } from "http-status-codes";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import sendToken from "../utils/jwtToken.js";
import { CustomRequest } from "../middlewares/auth.middleware.js";
import jwt, { JwtPayload } from "jsonwebtoken";

export const loginUser = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: { email: string, password: string } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Please provide email and password", StatusCodes.NOT_FOUND));
    }

    const user = await User.findOne({ email });
    if (!user) {
        return next(new ErrorHandler("Invalid email or password", StatusCodes.BAD_REQUEST));
    }
    const isPassword = await user.comparePassword(password);
    if (!isPassword) {
        return next(new ErrorHandler("Invalid email or password", StatusCodes.BAD_REQUEST));
    }

    const { accessToken, refreshToken } = sendToken(user, res);

    res.status(StatusCodes.OK).json({
        message: "User logged in successfully",
        user,
        accessToken,
        refreshToken
    });
});

export const registerUser = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    if (!name ||!email ||!password) {
        return next(new ErrorHandler("Please provide name, email, and password", StatusCodes.NOT_FOUND));
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new ErrorHandler("Email already exists", StatusCodes.CONFLICT));
    }

    const user = await User.create({
        name,
        email,
        password,
        role: process.env.ADMIN_EMAIL === email ? UserRole.ADMIN : UserRole.USER
    });
    const { accessToken, refreshToken } = sendToken(user, res);

    res.status(StatusCodes.CREATED).json({
        message: "User registered successfully",
        user,
        accessToken,
        refreshToken
    });
});

export const getUserProfile = catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?._id);
    if (!user) {
        return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));
    }

    res.status(StatusCodes.OK).json({
        message: "User fetched successfully",
        user,
    });
});

export const logoutUser = catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?._id);
    if (!user) {
        return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as boolean | "strict" | "none" | "lax" | undefined,
    }

    res.clearCookie("access_token", options);
    res.clearCookie("refresh_token", options);

    res.status(StatusCodes.OK).json({
        message: "User fetched successfully",
        user,
    });
});

export const refreshToken = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies["refresh_token"] || req.headers.authorization?.split(' ')?.[1] as string | undefined;
    if (!refreshToken) {
        return next(new ErrorHandler("Unauthorized access", StatusCodes.FORBIDDEN));
    }

    const decoded = jwt.verify(refreshToken!, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload & { id: string, email: string, role: string };
    const user = await User.findById(decoded.id);
    if (!user) {
        return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));
    }

    const { accessToken } = sendToken(user, res);

    res.status(StatusCodes.OK).json({
        message: "User token refreshed successfully",
        user,
        accessToken,
    });
});