const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");

const Transaction = require("./models/transaction");
const User = require("./models/user");

const {checkForAuthenticationCookie} = require("./middlewares/authentication");

const app = express();
const PORT = 8000;

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

mongoose
    .connect("mongodb://localhost:27017/expensify")
    .then(() => console.log("MongoDb Connected!"));

const userRouter = require("./routes/user");
const transactionRouter = require("./routes/transaction");


app.use(express.static("public")); 
app.use(express.urlencoded({extended : false}));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));


app.get("/test", (req,res) => {
    res.render("test");
});


app.post("/test",(req, res) => {
    const selectedDate = req.body.date;
    res.send(`You selected: ${selectedDate}`);
});

app.use("/user", userRouter);
app.use("/transaction",transactionRouter);

app.get("/profile", async (req, res) => {
    if(req.user){
        const user = await User.findById(req.user._id);
        
        res.render("profile", { user });
    }else{
        res.render("profile");
    }
});

app.get("/", async (req, res) => {
    try {
        if (!req.user) {
            return res.render("homePage", { 
                user: null,
                allTransactions: [],
                balance: 0 
            });
        }
        

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const allTransactions = await Transaction.find({
        userId: req.user._id,
        dateOfTransaction: { $gte: today, $lt: tomorrow }
        });

        const user = await User.findById(req.user._id);

        if (!user) {
            throw new Error("User not found");
        }

        res.render("homePage", { 
            user: req.user, 
            allTransactions,
            balance: user.currBalance 
        });
        
    } catch (error) {
        console.error("Homepage error:", error);
        res.render("homePage", {
            user: null,
            allTransactions: [],
            balance: 0,
            error: "Failed to load data"
        });
    }
});

app.listen(PORT, () => console.log(`Server connected at PORT: ${PORT}`));


