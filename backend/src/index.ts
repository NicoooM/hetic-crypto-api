import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import type { Filters } from "types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT;

if (!port) {
  console.error("Port is not defined");
  process.exit(1);
}

app.use(express.json());
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
        id: 1, // todo: get user id with auth
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
        userId: 1, // todo: get user id with auth
      },
    });
    res.json(wallets);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/profile", async (req, res) => {
  try {
    const profile = await prisma.user.findUnique({
      where: {
        id: 1, // todo: get user id with auth
      },
      select: {
        name: true,
        email: true,
      },
    });
    res.json(profile);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/wallet", async (req, res) => {
  const { address, userId, title } = req.body;

  if (!address || !userId || !title) {
    res.status(400).json({ error: "Address and userId are required" });
  }

  try {
    const wallet = await prisma.wallet.create({
      data: {
        userId: 1, // todo: get user id with auth
        address: address,
        title: title,
      },
    });
    res.status(201).json(wallet);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.patch("/profile", async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.update({
      where: {
        id: 1, // todo: get user id with auth
      },
      data: {
        name: name || null,
        email: email, // todo: need to re-check if new email
        password: hashedPassword,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      res.status(400).json({ error: "Account edition failed" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

app.delete("/wallet/:id", async (req, res) => {
  const walletId = parseInt(req.params.id, 10);

  if (isNaN(walletId)) {
    res.status(400).json({ error: "Invalid wallet id" });
  }

  try {
    await prisma.walletHistory.deleteMany({
      where: {
        walletId: walletId,
        wallet: {
          userId: 1, // todo: get user id with auth
        },
      },
    });
    await prisma.wallet.delete({
      where: {
        id: walletId,
        userId: 1, // todo: get user id with auth
      },
    });

    res.status(204).send();
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      res.status(404).json({ error: "Wallet not found" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
