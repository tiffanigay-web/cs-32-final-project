import "dotenv/config";
import cors from "cors";
import express from "express";
import router from "./routes/index.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", router);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(400).json({ message: err.message });
});

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  console.log(`GrowPath API running on http://localhost:${port}`);
});
