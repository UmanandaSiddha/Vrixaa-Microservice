import { Schema, model } from 'mongoose';

const CourseSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        price: { type: Number, required: true },
        duration: { type: Number, required: true },
        content: [
            {
                type: { type: String, enum: ['VIDEO', 'TEXT', 'QUIZ'], required: true },
                url: { type: String, required: true },
            },
        ],
    },
    { timestamps: true }
);

const Course = model('Course', CourseSchema);
export default Course;