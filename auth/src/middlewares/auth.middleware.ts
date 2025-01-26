import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/user.model.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
    user?: IUser;
}

export const isAuthenticatedUser = catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const accessToken = req.cookies["access_token"] || req.headers.authorization?.split(' ')?.[1] as string | undefined;
    if (!accessToken) {
        return next(new ErrorHandler("Unauthorized access", StatusCodes.FORBIDDEN));
    }

    const decoded = jwt.verify(accessToken!, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload & { id: string, email: string, role: string };
    const user = await User.findById(decoded.id);
    if (!user) {
        return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));
    }
    req.user = user;
    next();
});

export const isUserVerified = catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.user?.isVerified) {
        return next(new ErrorHandler("Please verify your email to access this resource", StatusCodes.UNAUTHORIZED));
    }
    next();
});

export const authorizeRoles = (...roles: string[]) => {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user || !roles.includes(req.user.role)) {
                return next(new ErrorHandler(`Role: ${req.user?.role} is not allowed to access this resource`, StatusCodes.UNAUTHORIZED));
            }
            next();
        } catch (error) {
            return next(new ErrorHandler("You are not authorized to access this route", StatusCodes.FORBIDDEN));
        }
    };
};