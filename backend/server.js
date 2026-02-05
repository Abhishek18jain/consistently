import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from "./src/app.js"
const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("connected successfully");
    app.listen(port, ()=>{
        console.log(`server is live ${port}`);
    })
}).catch((err)=>{
      console.error("❌ Mongo connection error:", err);
    process.exit(1);
})
