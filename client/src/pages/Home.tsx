import React from "react";

const Home = () => (
  <div className="h-[calc(100vh-60px)] w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
    <div className="flex justify-center items-center flex-col pt-40">
      <h1 className="text-3xl font-bold">Welcome to Monolith</h1>
      <p className="mt-4">All in one wallet tracker.</p>
      <div className="flex flex-row gap-4">
        <a
          href="/dashboard"
          className="bg-primary text-white px-4 py-2 rounded-md mt-4"
        >
          Dashboard
        </a>
        <a
          href="/fiscalite"
          className="bg-primary text-white px-4 py-2 rounded-md mt-4"
        >
          Fiscalité
        </a>
        <a
          href="/graph"
          className="bg-primary text-white px-4 py-2 rounded-md mt-4"
        >
          Graphique
        </a>
      </div>
    </div>
  </div>
);

export default Home;
