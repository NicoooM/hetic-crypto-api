import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import requestIp from "request-ip";
import { verifyEnv } from "utils/verify-env";
import { router } from "routes";

const app = express();
const port = process.env.PORT;

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(requestIp.mw());
app.use("/api/v1", router);

app.listen(port, () => {
  verifyEnv();
  console.log(`Listening on port ${port}...`);
});
