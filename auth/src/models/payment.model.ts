import { Schema, model } from 'mongoose';

const PaymentSchema = new Schema(
    {
        payerType: { type: String, enum: ['USER', 'ORGANIZATION'], required: true },
        payerId: { type: Schema.Types.ObjectId, required: true },
        amount: { type: Number, required: true },
        paymentDate: { type: Date, default: Date.now },
        paymentMethod: { type: String, enum: ['CREDIT_CARD', 'PAYPAL', 'BANK_TRANSFER'], required: true },
        status: { type: String, enum: ['SUCCESS', 'FAILED', 'PENDING'], default: 'PENDING' },
    },
    { timestamps: true }
);

const Payment = model('Payment', PaymentSchema);
export default Payment;