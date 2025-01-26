import { CookieOptions, Response } from "express";
import { IUser } from "../models/user.model.js";

interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

const generateOptions = (expireTime: number) => {
    if (isNaN(expireTime)) {
        throw new Error("Invalid COOKIE_EXPIRE environment variable");
    }

    const options: CookieOptions = {
        expires: new Date(Date.now() + (expireTime * 24 * 60 * 60 * 1000)),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict',
    };
    
    return options;
}

const sendToken = (user: IUser, res: Response): TokenResponse => {
    const accessToken = user.generateJWTToken("ACCESS_TOKEN");
    const refreshToken = user.generateJWTToken("REFRESH_TOKEN");

    const accessTokenOptions = generateOptions(Number(process.env.ACCESS_COOKIE_EXPIRE));
    const refreshTokenOptions = generateOptions(Number(process.env.REFRESH_COOKIE_EXPIRE));

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    return {
        accessToken,
        refreshToken,
    }
};

export default sendToken;