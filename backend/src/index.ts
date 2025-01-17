import express from "express";
import { prisma } from "lib/prisma";
import { router } from "routes";
import { verifyEnv } from "utils/verify-env";
import cors from "cors";
import helmet from "helmet";

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/api/v1", router);
app.use(helmet());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  verifyEnv();
  console.log(`Listening on port ${port}...`);
});
