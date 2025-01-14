import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import type { Filters } from "types";

const app = express();
const port = 8080;
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

  const { startDate } = req.query;
  const filters: Filters = { walletId: walletId };

  if (startDate) {
    filters.date = { ...filters.date, gte: new Date(startDate as string) };
  }

  try {
    const walletHistory = await prisma.walletHistory.findMany({
      where: filters,
    });

    if (walletHistory.length === 0) {
      res.status(404).json({ error: "Wallet history not found" });
    }

    res.json(walletHistory);
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
