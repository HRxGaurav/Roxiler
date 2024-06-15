import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    dateOfSale: {
        type: Date,
        required: true
    },
    category: String,
    image: String,
    isSold: {
        type: Boolean,
        default: false
    }
});



const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;