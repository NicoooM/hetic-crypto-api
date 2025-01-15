import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

type TimeRange = '1H' | '24H' | '7D' | '1M' | '1Y' | 'ALL';

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

const Dashboard = () => {
    const [timeRange, setTimeRange] = useState<TimeRange>('24H');
    const [data, setData] = useState<PriceEvolution[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [portfolioData, setPortfolioData] = useState<AssetData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`http://localhost:8080/history/2`);
                const result = await response.json();
                
            
                const newData = result.map((item: any) => ({
                    date: new Date(item.date).toLocaleDateString(),
                    price: item.quantity
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
    }, [timeRange]);

    useEffect(() => {
        const fetchPortfolioData = async () => {
            try {
                const response = await fetch('http://localhost:8080/portfolio/2');
                if (response.ok) {
                    const data = await response.json();
                    setPortfolioData(data);
                }
            } catch (err) {
                console.error('Erreur lors de la récupération du portfolio:', err);
            }
        };

        fetchPortfolioData();
    }, []);

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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocation</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variation 24h</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valeur</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variation Valeur 24h</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {portfolioData && (
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap">{formatPercent(portfolioData.allocation)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(portfolioData.price)}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap ${portfolioData.dailyPrice >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {formatPercent(portfolioData.dailyPrice)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(portfolioData.value)}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap ${portfolioData.dailyValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
