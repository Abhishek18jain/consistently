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
app.get("/", (req, res) => {
  res.send("API running");
});

export default app;
