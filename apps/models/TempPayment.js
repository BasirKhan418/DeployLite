import mongoose from "mongoose";
import { Schema } from "mongoose";

const TempPaymentSchema = Schema({
    email: { 
        type: String, 
        required: true,
        trim: true,
        lowercase: true
    },
    amount: { 
        type: Number, 
        required: true,
        min: 1
    },
    orderId: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    }
}, { 
    timestamps: true,
   
    expires: 3600
});


TempPaymentSchema.index({ email: 1, createdAt: -1 });
TempPaymentSchema.index({ orderId: 1 });


mongoose.models = {};

export default mongoose.model('TempPayment', TempPaymentSchema);