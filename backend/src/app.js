import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import routes from "../src/routes/index.js"
const app = express();


const allowedOrigins = [
  "http://localhost:3000",
  "https://consistently-e4p7l30hk-abhishek18jains-projects.vercel.app",
  "https://consistently-2k41mu7dh-abhishek18jains-projects.vercel.app"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"))


app.use("/", routes);
app.get("/", (req, res) => {
  res.send("API running");
});
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
