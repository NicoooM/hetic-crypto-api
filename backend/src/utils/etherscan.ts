import BigNumber from "bignumber.js";

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
    const newTransactions = data.result
      .filter((tx) => tx.isError === "0")
      .map((transaction) => ({
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
    const newTransactions = data.result
      .filter((tx) => tx.isError === "0")
      .map((transaction) => ({
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
  const valuePerDay: Record<string, BigNumber> = {};

  transactions.forEach((transaction, index) => {
    const date = new Date(Number(transaction.timeStamp) * 1000).toDateString();

    // Convert all values to BigNumber
    const transactionValue = new BigNumber(transaction.value);
    const gasUsed = new BigNumber(transaction.gasUsed);
    const gasPriceInWei = new BigNumber(transaction.gasPrice);

    // Calculate gas cost in Ether
    const gasCost = gasUsed
      .multipliedBy(gasPriceInWei)
      .dividedBy(new BigNumber(10).pow(18));

    if (transaction.fromMyWallet) {
      console.log(`Transaction ${index} (Outgoing):`);
      console.log(`Date: ${date}`);
      console.log(`Gas cost: ${gasCost.toString()} ETH`);
      const totalDeduction = transactionValue
        .dividedBy(new BigNumber(10).pow(18))
        .plus(gasCost);
      console.log(`Total deduction: ${totalDeduction.toString()} ETH`);

      valuePerDay[date] = (valuePerDay[date] || new BigNumber(0)).minus(
        totalDeduction
      );
    } else {
      console.log(`Transaction ${index} (Incoming):`);
      console.log(`Date: ${date}`);
      const valueToAdd = transactionValue.dividedBy(new BigNumber(10).pow(18));
      console.log(`Value to add: ${valueToAdd.toString()} ETH`);

      valuePerDay[date] = (valuePerDay[date] || new BigNumber(0)).plus(
        valueToAdd
      );
    }

    console.log(
      `Current value for ${date}: ${valuePerDay[date].toString()} ETH`
    );
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

  console.log("First few transactions after sorting:");
  allTransactions.slice(0, 5).forEach((tx, index) => {
    const value = new BigNumber(tx.value).dividedBy(new BigNumber(10).pow(18));
    console.log(
      `${index + 1}. Timestamp: ${new Date(
        parseInt(tx.timeStamp) * 1000
      ).toISOString()}, Value: ${value.toString()} ETH, From: ${tx.from}, To: ${
        tx.to
      }`
    );
  });

  const valuePerDay = calculateValuePerDay(allTransactions);

  // Sort dates for the final history
  const sortedDates = Object.keys(valuePerDay).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  let cumulativeValue = new BigNumber(0);
  const walletHistory = sortedDates.map((date) => {
    cumulativeValue = cumulativeValue.plus(new BigNumber(valuePerDay[date]));
    console.log(
      `Date: ${date}, Daily Change: ${valuePerDay[
        date
      ].toString()} ETH, New Total: ${cumulativeValue.toString()} ETH`
    );
    return {
      walletId: wallet,
      date: new Date(date),
      value: cumulativeValue.toNumber(), // Convert back to number for storage/display
    };
  });

  return walletHistory;
};

(async () => {
  const walletHistory = await createWalletHistory(
    "0xd0b08671ec13b451823ad9bc5401ce908872e7c5"
  );

  const totalValue = walletHistory[walletHistory.length - 1]?.value || 0; // Total value at the last day

  // print the first 10

  // print the total value
  // console.log("Total Wallet Value:", totalValue.toFixed(2));

  // // print the cumulative wallet history
  // console.log("Cumulative Wallet History (from the first entry to the last):");

  // console.log("Cumulative Wallet History:", walletHistory);
  // console.log("Top 10 Wallet History:");
  // walletHistory.slice(0, 10).forEach((entry, index) => {
  //   console.log(
  //     `${index + 1}. ${entry.date.toLocaleDateString()}: ${entry.value} Ether`
  //   );
  // });
  console.log("Final Total Wallet Value:", totalValue);
})();
