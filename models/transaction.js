const {Schema, model} = require("mongoose");

const transactionSchema = new Schema({
    typeOfTransaction: {
        type: String,
        enum: ["Debit","Credit"],
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        enum: ["Household", "Food","Transportation","Entertainment","Healthcare","Education","Shopping","Others","Salary","Scholarship","Refund","Freelance"],
        default: "Other",
    },
    dateOfTransaction: {
        type: Date,
        default: Date.now,
        get: function(date) {
            return date.toISOString().split('T')[0];
        }
    }
}, {
    toJSON: { getters: true },
    toObject: { getters: true }
});

const Transaction = model("transaction",transactionSchema);

module.exports = Transaction;
