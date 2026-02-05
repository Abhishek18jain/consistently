import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
// import ratelimit from "express-rate-limit"
// import rateLimit from "express-rate-limit";

// import analytics from "./routes/analytics.routes.js";
// import journalRoutes from "./routes/journal.routes.js";
// import pageRoutes from "./routes/page.routes.js";
// import coach from "./routes/coach.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"))

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
// });

// app.use(limiter);
app.use("/api/auth", authRoutes)
// app.use("/api/journal", journalRoutes);
// app.use("/api/journal/page", pageRoutes);
// app.use("/api/dashboard",analytics);
// app.use("/api/coach",coach);



app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
