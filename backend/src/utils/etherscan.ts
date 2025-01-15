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
  gas: string;
  gasPrice: string;
  isError: string;
  cumulativeGasUsed: string;
  gasUsed: string;
}

interface TransactionData extends Transaction {
  fromMyWallet: boolean;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getAllNormalTransactions = async (wallet: string) => {
  let endTransactionBlock = "99999999";
  let transactions: TransactionData[] = [];
  let lastTransactionHash = ""; // Track the last transaction hash

  console.log(wallet);

  while (true) {
    const url = `https://api.etherscan.io/v2/api?chainid=1&module=account&action=txlist&address=${wallet}&startblock=0&endblock=${endTransactionBlock}&page=1&offset=10000&sort=desc&apikey=${process.env.ETHERSCAN_API_KEY}`;

    const response = await fetch(url);
    const data: EtherscanResponse = await response.json();

    if (data.status === "0") {
      console.error(data.result);
      break;
    }

    console.log(data.result);

    const newTransactions = data.result.map((transaction) => ({
      ...transaction,
      fromMyWallet: transaction.from === wallet.toLowerCase(),
    }));

    if (
      newTransactions.length === 0 ||
      (newTransactions.length === 1 &&
        newTransactions[0].hash === lastTransactionHash)
    ) {
      break;
    }

    const uniqueTransactions = newTransactions.filter(
      (tx) => tx.hash !== lastTransactionHash
    );

    lastTransactionHash = newTransactions[newTransactions.length - 1].hash;

    transactions.push(...uniqueTransactions);

    endTransactionBlock = data.result[data.result.length - 1].blockNumber;

    await sleep(200); // 200ms delay (adjust as needed based on your API rate limit)
  }

  return transactions;
};

const getAllInternalTransactions = async (wallet: string) => {
  let endTransactionBlock = "99999999";
  let transactions: TransactionData[] = [];
  let lastTransactionHash = ""; // Track the last transaction hash

  while (true) {
    const url = `https://api.etherscan.io/api?module=account&action=txlistinternal&address=${wallet}&startblock=0&endblock=${endTransactionBlock}&page=1&offset=10000&sort=desc&apikey=${process.env.ETHERSCAN_API_KEY}`;

    const response = await fetch(url);
    const data: EtherscanResponse = await response.json();

    if (data.status === "0") {
      console.error(data.result);
      break;
    }

    const newTransactions = data.result.map((transaction) => ({
      ...transaction,
      fromMyWallet: transaction.from === wallet.toLowerCase(),
    }));

    if (
      newTransactions.length === 0 ||
      (newTransactions.length === 1 &&
        newTransactions[0].hash === lastTransactionHash)
    ) {
      break;
    }

    const uniqueTransactions = newTransactions.filter(
      (tx) => tx.hash !== lastTransactionHash
    );

    lastTransactionHash = newTransactions[newTransactions.length - 1].hash;

    transactions.push(...uniqueTransactions);

    endTransactionBlock = data.result[data.result.length - 1].blockNumber;

    await sleep(200); // 200ms delay (adjust as needed based on your API rate limit)
  }

  return transactions;
};

const calculateValuePerDay = (transactions: TransactionData[]) => {
  const valuePerDay: Record<string, number> = {};

  transactions.forEach((transaction) => {
    // Convert timestamp to a readable date string
    const date = new Date(Number(transaction.timeStamp) * 1000).toDateString();

    // Parse transaction value, gasUsed, and gasPrice as numbers
    const transactionValue = parseFloat(transaction.value);
    const gasUsed = parseFloat(transaction.gasUsed);
    const gasPriceInWei = parseFloat(transaction.gasPrice);

    // Calculate gas cost in Ether
    const gasCost = (gasUsed * gasPriceInWei) / 1e18;

    // Update value per day based on transaction direction
    if (transaction.fromMyWallet) {
      console.log("Gas cost ", gasCost);
      console.log(transactionValue + gasCost);
      // Deduct both value and gas cost
      valuePerDay[date] =
        (valuePerDay[date] || 0) - (transactionValue / 1e18 + gasCost);
    } else {
      // Add only the value (not gas cost)
      valuePerDay[date] = (valuePerDay[date] || 0) + transactionValue / 1e18;
    }
  });

  return valuePerDay;
};

const createWalletHistory = async (wallet: string) => {
  const normalTransactions = await getAllNormalTransactions(wallet);

  console.log(normalTransactions);

  const internalTransactions = await getAllInternalTransactions(wallet);

  const allTransactions = [...normalTransactions, ...internalTransactions];

  const valuePerDay = calculateValuePerDay(allTransactions);

  console.log(
    "VALUE PER DAY ----------------------------------------------------------------"
  );
  console.log(valuePerDay);

  // Sort dates to ensure correct cumulative calculation
  const sortedDates = Object.keys(valuePerDay).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  let cumulativeValue = 0;

  const walletHistory = sortedDates.map((date) => {
    cumulativeValue += valuePerDay[date]; // Add current day's value to the cumulative total
    return {
      walletId: wallet,
      date: new Date(date),
      value: cumulativeValue,
    };
  });

  console.log(walletHistory);

  return walletHistory;
};

(async () => {
  const walletHistory = await createWalletHistory(
    "0x9B7e3b22E89a51103aEF7ADEf031201AAF10D795"
  );

  const totalValue = walletHistory[walletHistory.length - 1]?.value || 0; // Total value at the last day

  console.log("Cumulative Wallet History:", walletHistory);
  console.log("Final Total Wallet Value:", totalValue);
})();
