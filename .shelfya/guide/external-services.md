# External Services Guide

This guide covers all external APIs used by the Hetic Crypto API, including setup, endpoints, and usage examples.

## 1. CryptoCompare API

We use CryptoCompare to fetch the current and historical price of ETH in EUR.

### Endpoints

- Current price  
  `GET https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=EUR`

- Historical price  
  `GET https://min-api.cryptocompare.com/data/pricehistorical?fsym=ETH&tsyms=EUR&ts={unix_timestamp}`

### Usage in PortfolioService

```typescript
// Fetch current price
const priceRes = await fetch(
  "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=EUR"
);
const { EUR: priceData } = await priceRes.json();

// Fetch yesterday’s price
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const ts = Math.floor(yesterday.getTime() / 1000);
const histRes = await fetch(
  `https://min-api.cryptocompare.com/data/pricehistorical?fsym=ETH&tsyms=EUR&ts=${ts}`
);
const { ETH: { EUR: yesterdayPrice } } = await histRes.json();

// Calculate daily change (%)
const dailyPrice = ((priceData - yesterdayPrice) / yesterdayPrice) * 100;
```

### Links

- CryptoCompare Docs: https://min-api.cryptocompare.com/documentation

---

## 2. Etherscan API

We use Etherscan to retrieve wallet balances and transactions (normal & internal).

### 2.1. Account Balance

Endpoint used in `PortfolioService`:

```typescript
const url = `https://api.etherscan.io/api
  ?module=account
  &action=balance
  &address=${walletAddress}
  &tag=latest
  &apikey=${process.env.ETHERSCAN_API_KEY}`;

const res = await fetch(url);
const { result: weiBalance } = await res.json();
const etherBalance = Number(weiBalance) / 10 ** 18;
```

### 2.2. Transaction History Utility

File: `backend/src/utils/etherscan.ts`

- **Normal transactions** (`action=txlist`)
- **Internal transactions** (`action=txlistinternal`)

Both use pagination and deduplication:

```typescript
const getAllNormalTransactions = async (wallet: string) => {
  let endBlock = "99999999";
  const allTx: TransactionData[] = [];
  const seen = new Set<string>();

  while (true) {
    const url = `https://api.etherscan.io/v2/api
      ?chainid=1
      &module=account
      &action=txlist
      &address=${wallet}
      &startblock=0
      &endblock=${endBlock}
      &page=1
      &offset=10000
      &sort=desc
      &apikey=${process.env.ETHERSCAN_API_KEY}`;

    const { result, status } = (await fetch(url).then(r => r.json())) as EtherscanResponse;
    if (status === "0" || !result.length) break;

    const batch = result
      .filter(tx => !seen.has(tx.hash))
      .map(tx => ({
        ...tx,
        fromMyWallet: tx.from.toLowerCase() === wallet.toLowerCase(),
      }));

    batch.forEach(tx => seen.add(tx.hash));
    allTx.push(...batch);
    endBlock = result[result.length - 1].blockNumber;
    await sleep(200);
  }

  return allTx;
};
```

#### Value-Per-Day Calculation

```typescript
const calculateValuePerDay = (txs: TransactionData[]) => {
  const daily: Record<string, bigint> = {};

  txs.forEach(tx => {
    const day = new Date(+tx.timeStamp * 1000).toISOString().split("T")[0];
    const value = BigInt(tx.value);
    const cost = tx.fromMyWallet
      ? value + BigInt(tx.gasUsed) * BigInt(tx.gasPrice)
      : value;

    daily[day] = (daily[day] || BigInt(0)) + (tx.fromMyWallet ? -cost : cost);
  });

  return daily;
};
```

### Environment Variables

- `ETHERSCAN_API_KEY` — Your Etherscan API key, set in `.env`

### Links

- Etherscan API Docs: https://docs.etherscan.io/api-endpoints

---

By following this guide, you can configure and extend the external services integrations in your Hetic Crypto API project.