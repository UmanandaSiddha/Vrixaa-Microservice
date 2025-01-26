import { Schema, model } from 'mongoose';

const SubscriptionPlanSchema = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        maxUsers: { type: Number, required: true },
        features: [{ type: String }],
    },
    { timestamps: true }
);

const SubscriptionPlan = model('SubscriptionPlan', SubscriptionPlanSchema);
export default SubscriptionPlan;