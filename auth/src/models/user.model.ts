import mongoose, { Document, Schema, model } from 'mongoose';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
    INSTRUCTOR = 'INSTRUCTOR',
}

enum AccessType {
    TIME_BASED = 'TIME_BASED',
    LIFETIME = 'LIFETIME',
}

export interface IUser extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    isVerified: boolean;
    role: typeof UserRole[keyof typeof UserRole];
    organization: mongoose.Schema.Types.ObjectId;
    courses: {
        course: mongoose.Schema.Types.ObjectId;
        accessType: typeof AccessType[keyof typeof AccessType];
        accessExpiry: Date;
    }[],
    createdAt: Date;
    updatedAt: Date;

    generateJWTToken(type: "ACCESS_TOKEN" | "REFRESH_TOKEN"): string;
    comparePassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, index: true, required: true, match: [/.+\@.+\..+/, 'Please enter a valid email address'] },
        password: { type: String, required: true },
        isVerified: { type: Boolean, default: false },
        role: { type: String, enum: UserRole, default: UserRole.USER },
        organization: { type: Schema.Types.ObjectId, ref: 'Organization', default: null },
        courses: [
            {
                course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
                accessType: { type: String, enum: AccessType, required: true },
                accessExpiry: { type: Date, required: false },
            },
        ],
    },
    { timestamps: true }
);

UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

UserSchema.methods.generateJWTToken = function (this: IUser, type: "ACCESS_TOKEN" | "REFRESH_TOKEN") {
    const secret = type === "ACCESS_TOKEN" ? process.env.ACCESS_TOKEN_SECRET! : process.env.REFRESH_TOKEN_SECRET!;
    const expiresIn = type === "ACCESS_TOKEN"? process.env.ACCESS_TOKEN_EXPIRE : process.env.REFRESH_TOKEN_EXPIRE;

    const payload = {
        id: this._id,
        email: this.email,
        role: this.role,
    }

    return jwt.sign(payload, secret, { expiresIn });
};

UserSchema.methods.comparePassword = async function (this: IUser, enteredPassword: string) {
    let isPasswordMatched;
    if (this.password) {
        isPasswordMatched = await bcrypt.compare(enteredPassword, this.password);
    }
    return isPasswordMatched;
};

const User = model('User', UserSchema);
export default User;