import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import type { Filters } from "types";

const app = express();
const port = process.env.PORT;
const prisma = new PrismaClient();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/history/:id", async (req, res) => {
  const walletId = parseInt(req.params.id, 10);

  if (isNaN(walletId)) {
    res.status(400).json({ error: "Invalid wallet id" });
  }

  const filters: Filters = {
    walletId: walletId,
    wallet: {
      user: {
        id: 1, // todo: user with auth
      },
    },
  };

  const { startDate } = req.query;
  if (startDate) {
    filters.date = { gte: new Date(startDate as string) };
  }

  try {
    const history = await prisma.walletHistory.findMany({
      where: filters,
    });

    if (history.length === 0) {
      res.status(404).json({ error: "Wallet history not found" });
    }

    res.json(history);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/wallets", async (req, res) => {
  try {
    const wallets = await prisma.wallet.findMany({
      where: {
        userId: 1, // todo: user with auth
      },
    });
    res.json(wallets);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/wallet", async (req, res) => {
  const { address, userId } = req.body;
  try {
    const wallet = await prisma.wallet.create({
      data: {
        userId: userId,
        address: address,
      },
    });
    res.status(201).json(wallet);
  } catch {
    res.status(400).json({ error: "Invalid request" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
