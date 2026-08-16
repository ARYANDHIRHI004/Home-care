import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Please provide an expense description'],
        trim: true,
    },
    category: {
        type: String,
        required: [true, 'Please provide an expense category'],
    },
    vendor: {
        type: String,
        trim: true,
    },
    amount: {
        type: Number,
        required: [true, 'Please provide the expense amount'],
    },
    paymentMethod: {
        type: String,
        enum: ['Corporate Card', 'UPI', 'Bank Transfer', 'Petty Cash', 'Cash', 'Other'],
        default: 'Other',
    },
    paidBy: {
        type: String,
        trim: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    receiptUrl: {
        type: String,
    }
}, {
    timestamps: true
});

export const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
