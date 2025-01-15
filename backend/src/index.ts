import express from "express";

import { prisma } from "lib/prisma";
import { router } from "routes";
import { verifyEnv } from "utils/verify-env";

const app = express();
const port = 8080;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(express.json());
app.use("/api/v1", router);

app.get("/history/:id", async (req, res) => {
  const walletId = parseInt(req.params.id, 10);

  if (isNaN(walletId)) {
    res.status(400).json({ error: "Invalid wallet id" });
  }

  try {
    const walletHistory = await prisma.walletHistory.findMany({
      where: {
        walletId: walletId,
      },
      include: {
        currency: true,
        wallet: true,
      },
    });

    if (walletHistory.length === 0) {
      res.status(404).json({ error: "Wallet history not found" });
    }

    res.json(walletHistory);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  verifyEnv();
  console.log(`Listening on port ${port}...`);
});
