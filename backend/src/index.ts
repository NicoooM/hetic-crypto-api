import express from "express";
import cors from "cors";
import helmet from "helmet";
import { verifyEnv } from "utils/verify-env";
import { router } from "routes";

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use("/api/v1", router);

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  verifyEnv();
  console.log(`Listening on port ${port}...`);
});
