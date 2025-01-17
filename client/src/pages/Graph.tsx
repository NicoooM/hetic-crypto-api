import React from "react";
import TransactionGraph from "../components/TransactionGraph";

const Graph = () => {
    return (
        <div className="min-h-[calc(100vh-60px)] w-full bg-white p-8">
            <h1 className="text-2xl font-bold font-mono mb-10">Visualisation des transactions</h1>
            <div className="bg-gray-100 rounded-lg p-6 h-[680px]">
                <TransactionGraph />
            </div>
        </div>
    );
};

export default Graph;
