const express = require("express");
const app = express();
require("dotenv").config()
const cors = require('cors');
const port = process.env.PORT
const mongoose = require("mongoose")
app.use(express.json())


const userRoute = require("./routes/user")


app.use('/api/users', userRoute)


// not handler error
app.use(function (req, res) {
    res.status(500).json("internal server error")
});

/// cors
app.use(cors({ origin: "*" }));

// route not found
app.use((req, res) => {
    res.status(404).json({ message: "Not Found" })
})


mongoose.connect("mongodb://127.0.0.1:27017/testFinalProject").then(() => {
    console.log("hello from mongodb");

}).catch((err) => {
    console.log(err);

})

app.listen(port, (req, res) => {
    console.log("hello from server", port);

})