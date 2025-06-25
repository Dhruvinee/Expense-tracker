const {Router} = require("express");
const Transaction = require("../models/transaction");
const User = require("../models/user");

const router = Router();

router.get("/", (req,res) => {
    res.render("transaction", {allTransactions: []});
})

router.post("/", async (req,res) => {
    const { date } = req.body;

    // If date is not selected, return an empty list
    if (!date) {
        return res.render("transaction", { allTransactions: [] });
    }

    const today = new Date(date);
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const allTransactions = await Transaction.find({
    userId: req.user._id,
    dateOfTransaction: { $gte: today, $lt: tomorrow }
    });

    res.render("transaction",{allTransactions});

})

router.post("/add", async (req,res) => {
    try {
        const { dateOfTransaction, typeOfTransaction, amount, category } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        if(typeOfTransaction == "Debit")
            var newAmount = user.currBalance - Number(amount);
        else
            var newAmount = user.currBalance + Number(amount);

        await User.updateOne(
            { _id: userId }, 
            { $set: { currBalance: newAmount } }
        );

        await Transaction.create({
            typeOfTransaction,
            userId,
            amount,
            category,
            dateOfTransaction,
        });

        return res.redirect("/");

    } catch (error) {
        console.error("Error in credit route:", error);
        return res.status(500).send("Internal Server Error");
    }
});


module.exports = router;
