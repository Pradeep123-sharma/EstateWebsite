import "./envLoader.js"
import dotenv from "dotenv"
import { app } from "./app.js"

import connectDB from "./db/dbconnect.js";



connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port: ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log("MongoDB connection failed !!!", err);
    })
