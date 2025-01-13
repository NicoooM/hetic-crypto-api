import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface PriceEvolution {
    date: string;
    price: number;
}

const fakeData: PriceEvolution[] = [
    { date: "2025-01-01", price: 1000 },
    { date: "2025-01-02", price: 1020 },
    { date: "2025-01-03", price: 980 },
    { date: "2025-01-04", price: 1050 },
    { date: "2025-01-05", price: 1100 },
    { date: "2025-01-06", price: 1080 },
    { date: "2025-01-07", price: 1150 },
];

const Dashboard = () => {
    const [data, setData] = useState<PriceEvolution[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setData(fakeData);
                setError(null);
            } catch (err) {
                setError("Failed to fetch data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="m-10 p-8 bg-white border border-gray-200 rounded-lg h-[85vh]">
            <h1 className="text-2xl font-bold font-mono">Crypto Wallet</h1>
            <h4 className="text-sm text-primary mt-3">Find here all the information about your wallet</h4>
            {isLoading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!isLoading && !error && data.length > 0 && (
                <div className="px-4 pt-20 bg-white rounded-lg">
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
        </div>
    );
};

export default Dashboard;
