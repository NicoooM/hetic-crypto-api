import express from "express";
import { prisma } from "lib/prisma";
import { router } from "routes";
import { verifyEnv } from "utils/verify-env";
import cors from "cors";

const app = express();
const port = process.env.PORT;

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  verifyEnv();
  console.log(`Listening on port ${port}...`);
});
