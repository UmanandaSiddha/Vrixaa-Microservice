import { Schema, model } from 'mongoose';

const EnrollmentSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        organization: { type: Schema.Types.ObjectId, ref: 'Organization', default: null },
        accessType: { type: String, enum: ['TIME_BASED', 'LIFETIME'], required: true },
        accessExpiry: { type: Date },
        progress: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Enrollment = model('Enrollment', EnrollmentSchema);
export default Enrollment;