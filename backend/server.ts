import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { env } from "./config/env";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: env.corsOrigins }));
app.use(compression());
app.use(express.json());

app.use("/api", routes);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Media Downloader API listening on http://localhost:${env.port}`);
});
