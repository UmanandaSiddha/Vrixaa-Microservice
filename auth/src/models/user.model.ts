import mongoose from "mongoose";

const roleEnum = {
    STUDENT: "STUDENT",
    INSTRUCTOR: "INSTRUCTOR",
    ADMIN: "ADMIN"
}

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: roleEnum,
            default: roleEnum.STUDENT
        },
        organizations: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Organization'
            }
        ],
        plans: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Plan'
            }
        ]
    },
    {
        timestamps: true
    }
)

export default mongoose.model('User', UserSchema);