import { Schema, model } from 'mongoose';

const OrganizationSchema = new Schema(
    {
        name: { type: String, required: true },
        admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        courses: [
            {
                course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
                accessType: { type: String, enum: ['TIME_BASED', 'LIFETIME'], required: true },
                accessExpiry: { type: Date, required: false },
            },
        ],
        subscriptionPlan: { type: String, enum: ['SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE'], required: true },
        subscriptionExpiry: { type: Date, required: true },
    },
    { timestamps: true }
);

const Organization = model('Organization', OrganizationSchema);
export default Organization;