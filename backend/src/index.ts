import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const port = 8080;
const prisma = new PrismaClient();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/history", async (req, res) => {
  const walletHistory = await prisma.walletHistory.findMany({
    where: {
      walletId: 1,
    },
    include: {
      currency: true,
      wallet: true,
    },
  });
  res.json(walletHistory);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
