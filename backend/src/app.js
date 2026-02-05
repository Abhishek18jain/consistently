import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import ratelimit from "express-rate-limit"

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"))

const limiter = ratelimit({
    windowMs:15*60*1000,
    max:100,

});
app.use(limiter);
app.use("/api/journal", journalRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
