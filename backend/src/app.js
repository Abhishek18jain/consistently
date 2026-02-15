import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import routes from "../src/routes/index.js"
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json()); // 🔥 REQUIRED
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"))


app.use("/api", routes);
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
