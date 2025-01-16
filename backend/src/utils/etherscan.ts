interface EtherscanResponse {
  status: string;
  message: string;
  result: Transaction[];
}

interface Transaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: bigint;
  gasPrice: bigint;
  isError: string;
  cumulativeGasUsed: bigint;
  gasUsed: bigint;
}

interface TransactionData extends Transaction {
  fromMyWallet: boolean;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getAllNormalTransactions = async (wallet: string) => {
  let endTransactionBlock = "99999999";
  let transactions: TransactionData[] = [];
  let processedHashes = new Set<string>(); // Keep track of all processed transaction hashes

  while (true) {
    const url = `https://api.etherscan.io/v2/api?chainid=1&module=account&action=txlist&address=${wallet}&startblock=0&endblock=${endTransactionBlock}&page=1&offset=10000&sort=desc&apikey=${process.env.ETHERSCAN_API_KEY}`;

    const response = await fetch(url);
    const data: EtherscanResponse = await response.json();

    if (data.status === "0") {
      console.error(data.result);
      break;
    }

    // Filter out error transactions first, then map the remaining ones
    const newTransactions = data.result.map((transaction) => ({
      ...transaction,
      fromMyWallet: transaction.from.toLowerCase() === wallet.toLowerCase(),
    }));

    if (newTransactions.length === 0) {
      break;
    }

    // Filter out only the transactions we've already processed
    const uniqueTransactions = newTransactions.filter(
      (tx) => !processedHashes.has(tx.hash)
    );

    // Add all transaction hashes from this batch to our set of processed hashes
    newTransactions.forEach((tx) => processedHashes.add(tx.hash));

    if (uniqueTransactions.length === 0) {
      break; // If we have no new transactions after filtering duplicates, we're done
    }

    transactions.push(...uniqueTransactions);
    endTransactionBlock = data.result[data.result.length - 1].blockNumber;

    await sleep(200);
  }

  return transactions;
};

const getAllInternalTransactions = async (wallet: string) => {
  let endTransactionBlock = "99999999";
  let transactions: TransactionData[] = [];
  let processedHashes = new Set<string>();

  while (true) {
    const url = `https://api.etherscan.io/api?module=account&action=txlistinternal&address=${wallet}&startblock=0&endblock=${endTransactionBlock}&page=1&offset=10000&sort=desc&apikey=${process.env.ETHERSCAN_API_KEY}`;

    const response = await fetch(url);
    const data: EtherscanResponse = await response.json();

    if (data.status === "0") {
      console.error(data.result);
      break;
    }

    // Filter out error transactions first, then map the remaining ones
    const newTransactions = data.result.map((transaction) => ({
      ...transaction,
      fromMyWallet: transaction.from.toLowerCase() === wallet.toLowerCase(),
    }));

    if (newTransactions.length === 0) {
      break;
    }

    // Filter out only the transactions we've already processed
    const uniqueTransactions = newTransactions.filter(
      (tx) => !processedHashes.has(tx.hash)
    );

    // Add all transaction hashes from this batch to our set of processed hashes
    newTransactions.forEach((tx) => processedHashes.add(tx.hash));

    if (uniqueTransactions.length === 0) {
      break; // If we have no new transactions after filtering duplicates, we're done
    }

    transactions.push(...uniqueTransactions);
    endTransactionBlock = data.result[data.result.length - 1].blockNumber;

    await sleep(200);
  }

  return transactions;
};

const calculateValuePerDay = (transactions: TransactionData[]) => {
  const valuePerDay: Record<string, bigint> = {};

  transactions.forEach((transaction, index) => {
    // Convert timestamp to a Date object
    const date = new Date(Number(transaction.timeStamp) * 1000);

    // Format the date as YYYY-MM-DD (ignoring time)
    const formattedDate = date.toISOString().split("T")[0];

    // Convert all values to BigInt
    const transactionValue = BigInt(transaction.value);

    if (transaction.fromMyWallet) {
      const gasUsed = BigInt(transaction.gasUsed);
      const gasPriceInWei = BigInt(transaction.gasPrice);

      // Deduct the transaction value and gas cost from the daily total
      valuePerDay[formattedDate] =
        (valuePerDay[formattedDate] || BigInt(0)) -
        (transactionValue + gasUsed * gasPriceInWei);
    } else {
      // Add the transaction value to the daily total
      valuePerDay[formattedDate] =
        (valuePerDay[formattedDate] || BigInt(0)) + transactionValue;
    }
  });

  return valuePerDay;
};

const createWalletHistory = async (wallet: string) => {
  const normalTransactions = await getAllNormalTransactions(wallet);
  const internalTransactions = await getAllInternalTransactions(wallet);

  // Combine and sort all transactions by timestamp
  const allTransactions = [...normalTransactions, ...internalTransactions].sort(
    (a, b) => parseInt(a.timeStamp) - parseInt(b.timeStamp)
  );

  console.log(allTransactions);

  const valuePerDay = calculateValuePerDay(allTransactions);

  // Sort dates for the final history
  const sortedDates = Object.keys(valuePerDay).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // Get the first transaction date and today's date
  const firstDate = new Date(sortedDates[0]);
  const today = new Date(); // Today's date

  // Generate all dates between the first transaction date and today (inclusive)
  const allDates = [];
  for (let d = new Date(firstDate); d <= today; d.setDate(d.getDate() + 1)) {
    allDates.push(new Date(d).toISOString().split("T")[0]);
  }

  let cumulativeValue = BigInt(0);
  const walletHistory = allDates.map((date) => {
    // If there is a transaction on this date, add its value to the cumulative value
    if (valuePerDay[date]) {
      cumulativeValue += valuePerDay[date];
    }

    return {
      walletId: wallet,
      date: new Date(date),
      value: Number(cumulativeValue) / 10 ** 18, // Convert back to number for storage/display
    };
  });

  return walletHistory;
};

(async () => {
  const walletHistory = await createWalletHistory(
    "0xd0b08671ec13b451823ad9bc5401ce908872e7c5"
  );

  const totalValue = walletHistory[walletHistory.length - 1]?.value || 0; // Total value at the last day (today)

  console.log(`Total value for wallet : ${totalValue} Ether`);
})();

// 0.027524332820616189
