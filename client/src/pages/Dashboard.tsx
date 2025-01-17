import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Select from "react-select";

import API from "services/api";

type TimeRange = "1H" | "24H" | "7D" | "1M" | "1Y" | "ALL";

interface PriceEvolution {
  date: string;
  price: number;
}

interface AssetData {
  allocation: number;
  price: number;
  dailyPrice: number;
  value: number;
  dailyValue: number;
}

interface WalletData {
  id: number;
  title: string;
}

const calculateStartDate = (timeRange: TimeRange): Date => {
  const now = new Date();
  switch (timeRange) {
    case "1H":
      now.setHours(now.getHours() - 1);
      break;
    case "24H":
      now.setDate(now.getDate() - 1);
      break;
    case "7D":
      now.setDate(now.getDate() - 7);
      break;
    case "1M":
      now.setMonth(now.getMonth() - 1);
      break;
    case "1Y":
      now.setFullYear(now.getFullYear() - 1);
      break;
    case "ALL":
      now.setFullYear(now.getFullYear() - 100);
      break;
    default:
      break;
  }
  return now;
};

const formatDate = (date: string) => {
  const [day, month, year] = date.split("/");
  const formattedDate = `${year}-${month}-${day}`;
  const dateObj = new Date(formattedDate);

  if (isNaN(dateObj.getTime())) {
    console.error("Invalid date:", date);
    return date;
  }

  const formattedDay = dateObj.getDate();
  const formattedMonth = dateObj.toLocaleString("default", { month: "short" });
  const formattedYear = dateObj.getFullYear();

  return `${formattedDay} ${formattedMonth} ${formattedYear}`;
};

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("7D");
  const [data, setData] = useState<PriceEvolution[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [portfolioData, setPortfolioData] = useState<AssetData | null>(null);
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [selectedWalletId, setSelectedWalletId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await API.get(`/wallet`);

        setWallets(response.data);
        setSelectedWalletId(response.data[0].id);
        setError(null);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedWalletId) return;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const startDate = calculateStartDate(timeRange);
        const response = await API.get(
          `/history/${selectedWalletId}?startDate=${startDate.toISOString()}`
        );
        console.log(response);

        const newData = response.data.map((item: any) => ({
          date: new Date(item.date).toLocaleDateString(),
          price: item.value.toFixed(2),
        }));

        setData(newData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange, selectedWalletId]);

  useEffect(() => {
    if (!selectedWalletId) return;
    const fetchPortfolioData = async () => {
      try {
        const response = await API.get(`/portfolio/${selectedWalletId}`);
        setPortfolioData(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération du portfolio:", err);
      }
    };

    fetchPortfolioData();
  }, [selectedWalletId]);

  const formatPercent = (value: number) => `${value.toFixed(2)}%`;
  const formatCurrency = (value: number) => `${value.toFixed(2)}€`;
  const timeRanges: TimeRange[] = ["1H", "24H", "7D", "1M", "1Y", "ALL"];

  const minPrice = Math.min(...data.map((item) => item.price)) * 0.8;
  const maxPrice = Math.max(...data.map((item) => item.price)) * 1.01;

  return (
    <div className="m-10 p-8 bg-white border border-gray-200 rounded-lg h-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-mono">Crypto Wallet</h1>
          <h4 className="text-sm text-primary mt-1">
            Find here all the information about your wallet
          </h4>
        </div>
        <Select
          options={wallets.map((wallet) => ({
            value: wallet.id,
            label: wallet.title,
          }))}
          onChange={(selected) =>
            setSelectedWalletId(selected?.value ? selected.value : null)
          }
          value={
            wallets
              .filter((wallet) => wallet.id === selectedWalletId)
              .map((wallet) => ({
                value: wallet.id,
                label: wallet.title,
              }))[0]
          }
        />
      </div>

      <div className="flex flex-row justify-between mb-4 mt-10">
        <h2 className="text-xl font-bold font-mono">Portfolio Value in €</h2>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={range === "1H" ? undefined : () => setTimeRange(range)}
              className={`px-4 py-2 rounded-md ${
                timeRange === range
                  ? "bg-primary text-white font-mono text-xs h-fit"
                  : range === "1H" || range === "24H"
                  ? "bg-gray-300 text-gray-500 font-mono text-xs h-fit cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200 font-mono text-xs h-fit"
              }`}
              disabled={range === "1H" || range === "24H"}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!isLoading && !error && data.length > 0 && (
        <div className="px-4 pt-4 bg-white rounded-lg">
          <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={formatDate} />
                <YAxis
                  domain={[minPrice, maxPrice]}
                  tickFormatter={(value) => `${value.toFixed(0)} €`}
                />
                <Tooltip formatter={(value) => `${value} €`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="price"
                  name="Crypto Wallet Price Evolution"
                  stroke="#003CE3"
                  strokeWidth={2}
                  dot={{ fill: "#003CE3", strokeWidth: 0.1 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      {!isLoading && !error && data.length === 0 && <p>No data available.</p>}
      {!isLoading && !error && (
        <div className="mt-10">
          <h2 className="text-xl font-bold font-mono mb-4">
            Portfolio Overview
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Allocation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variation 24h
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variation Valeur 24h
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {portfolioData && (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatPercent(portfolioData.allocation)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatCurrency(portfolioData.price)}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap ${
                        portfolioData.dailyPrice >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatPercent(portfolioData.dailyPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatCurrency(portfolioData.value)}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap ${
                        portfolioData.dailyValue >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatCurrency(portfolioData.dailyValue)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
