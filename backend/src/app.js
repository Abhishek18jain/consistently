import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import routes from "../src/routes/index.js"
const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://consistently.vercel.app"
  ],
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"))


app.use("/api", routes);
app.get("/", (req, res) => {
  res.send("API running");
});

export default app;
