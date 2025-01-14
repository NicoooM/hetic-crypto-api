import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

type TimeRange = '1H' | '24H' | '7D' | '1M' | '1Y' | 'ALL';

interface PriceEvolution {
    date: string;
    price: number;
}

interface AssetData {
    asset: string;
    allocation: number;
    price: number;
    change24h: number;
    costBasis: number;
    marketValue: number;
    unrealizedReturn: number;
    lastDayChange: number;
}

// Ajout de données factices pour différentes périodes
const generateFakeDataForTimeRange = (range: TimeRange): PriceEvolution[] => {
    const now = new Date();
    const data: PriceEvolution[] = [];
    
    switch (range) {
        case '1H':
            // Données par 5 minutes
            for (let i = 12; i >= 0; i--) {
                const date = new Date(now.getTime() - i * 5 * 60000);
                data.push({
                    date: date.toLocaleTimeString(),
                    price: 1000 + Math.random() * 50
                });
            }
            break;
        case '24H':
            // Données par heure
            for (let i = 24; i >= 0; i--) {
                const date = new Date(now.getTime() - i * 3600000);
                data.push({
                    date: date.toLocaleTimeString(),
                    price: 1000 + Math.random() * 100
                });
            }
            break;
        case '7D':
            // Données par jour
            for (let i = 7; i >= 0; i--) {
                const date = new Date(now.getTime() - i * 86400000);
                data.push({
                    date: date.toLocaleDateString(),
                    price: 1000 + Math.random() * 200
                });
            }
            break;
        case '1M':
            // Données par 3 jours
            for (let i = 10; i >= 0; i--) {
                const date = new Date(now.getTime() - i * 3 * 86400000);
                data.push({
                    date: date.toLocaleDateString(),
                    price: 1000 + Math.random() * 300
                });
            }
            break;
        case '1Y':
            // Données par mois
            for (let i = 12; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                data.push({
                    date: date.toLocaleDateString(),
                    price: 1000 + Math.random() * 500
                });
            }
            break;
        case 'ALL':
            // Données par année
            for (let i = 5; i >= 0; i--) {
                const date = new Date(now.getFullYear() - i, 0, 1);
                data.push({
                    date: date.getFullYear().toString(),
                    price: 1000 + Math.random() * 1000
                });
            }
            break;
    }
    return data;
};

const fakeTableData: AssetData[] = [
    {
        asset: "Bitcoin",
        allocation: 45.5,
        price: 65000,
        change24h: 2.5,
        costBasis: 50000,
        marketValue: 75000,
        unrealizedReturn: 25,
        lastDayChange: 1800,
    },
    {
        asset: "Ethereum",
        allocation: 30.2,
        price: 3500,
        change24h: -1.2,
        costBasis: 3000,
        marketValue: 45000,
        unrealizedReturn: 16.7,
        lastDayChange: -400,
    },
    {
        asset: "Solana",
        allocation: 24.3,
        price: 120,
        change24h: 5.8,
        costBasis: 90,
        marketValue: 30000,
        unrealizedReturn: 33.3,
        lastDayChange: 600,
    },
];

const Dashboard = () => {
    const [timeRange, setTimeRange] = useState<TimeRange>('24H');
    const [data, setData] = useState<PriceEvolution[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Simuler un appel API
                await new Promise((resolve) => setTimeout(resolve, 500));
                const newData = generateFakeDataForTimeRange(timeRange);
                setData(newData);
                setError(null);
            } catch (err) {
                setError("Failed to fetch data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [timeRange]); // Recharger les données quand timeRange change

    const formatPercent = (value: number) => `${value.toFixed(2)}%`;
    const formatCurrency = (value: number) => `${value.toLocaleString()}$`;
    const timeRanges: TimeRange[] = ['1H', '24H', '7D', '1M', '1Y', 'ALL'];

    return (
        <div className="m-10 p-8 bg-white border border-gray-200 rounded-lg h-auto">
            <h1 className="text-2xl font-bold font-mono">Crypto Wallet</h1>
            <h4 className="text-sm text-primary mt-1">Find here all the information about your wallet</h4>

            <div className="flex flex-row justify-between mb-4 mt-10">
                <h2 className="text-xl font-bold font-mono">Portfolio Value</h2>
                
                {/* Time Range Selector */}
                <div className="flex gap-2">
                    {timeRanges.map((range) => (
                        <button
                            key={range}
                            onClick={range === '1H' ? undefined : () => setTimeRange(range)}
                            className={`px-4 py-2 rounded-md ${
                                timeRange === range
                                    ? 'bg-primary text-white font-mono text-xs h-fit'
                                    : range === '1H'
                                    ? 'bg-gray-300 text-gray-500 font-mono text-xs h-fit cursor-not-allowed'
                                    : 'bg-gray-100 hover:bg-gray-200 font-mono text-xs h-fit'
                            }`}
                            disabled={range === '1H'}
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
                    <div style={{ width: '100%', height: 400 }}>
                        <ResponsiveContainer>
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="price" 
                                    name="Crypto Wallet Price Evolution"
                                    stroke="#FF5F2D" 
                                    strokeWidth={2}
                                    dot={{ fill: '#FF5F2D' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
            {!isLoading && !error && data.length === 0 && <p>No data available.</p>}
            {!isLoading && !error && (
                <div className="mt-10">
                    <h2 className="text-xl font-bold font-mono mb-4">Portfolio Overview</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assets</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocation</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">24h%</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost Basis</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Value</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unrealized Return</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Day Change</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {fakeTableData.map((asset, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">{asset.asset}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{formatPercent(asset.allocation)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(asset.price)}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap ${asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {formatPercent(asset.change24h)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(asset.costBasis)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(asset.marketValue)}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap ${asset.unrealizedReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {formatPercent(asset.unrealizedReturn)}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap ${asset.lastDayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {formatCurrency(asset.lastDayChange)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
