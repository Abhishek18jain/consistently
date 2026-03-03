import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from "./src/app.js"
// import journalRoutes from "./routes/journal.routes.js";





mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("connected successfully");
    app.listen(port, ()=>{
        console.log(`server is live ${port}`);
    })
}).catch((err)=>{
      console.error("❌ Mongo connection error:", err);
    process.exit(1);
})
// app.use((err, req, res, next) => {
//   res.status(err.statusCode || 500).json({
//     message: err.message || "Server error"
//   });
//   next()
// });

const port = process.env.PORT || 5000;