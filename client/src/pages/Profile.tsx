import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

const Profile = () => {
    const [wallet, setWallet] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [wallets, setWallets] = useState<{ id: number, address: string, userId: number }[]>([]);

    useEffect(() => {
        fetchWallets();
    }, []);

    const fetchWallets = async () => {
        try {
            const response = await fetch('http://localhost:8080/wallets');
            const data = await response.json();
            setWallets(data);
        } catch (err) {
            setError('Erreur lors de la récupération des wallets');
        }
    };

    const createWallet = async () => {
        try {
            const response = await fetch('http://localhost:8080/wallet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    address: wallet,
                    userId: 1
                })
            });
            
            if (response.status === 201) {
                setError('Wallet ajouté avec succès!');
                setWallet('');
            }
        } catch (err) {
            setError('Erreur lors de la création du wallet');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createWallet();
    };

    return (
        <div className="m-10 p-4 space-y-4 bg-white border border-gray-200 rounded-lg">
            {error && (
                <div className={`${error.includes('succès') ? 'text-green-500' : 'text-red-500'}`}>
                    {error}
                </div>
            )}
            <h1 className="text-2xl font-bold font-mono">Profile</h1>

            <div className="mt-8">
                <h2 className="text-xl font-bold font-mono mb-4">Mes informations</h2>
                <div className="flex flex-row justify-between gap-2">
                    <div className="text-sm font-mono p-2 bg-gray-100 rounded w-full">Nom</div>
                    <div className="text-sm font-mono p-2 bg-gray-100 rounded w-full">Email</div>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold font-mono mb-4">Mes Wallets</h2>
                {wallets.length > 0 ? (
                    <ul className="space-y-2">
                        {wallets.map((wallet) => (
                            <li key={wallet.id} className="">
                                <div className="flex flex-row justify-between gap-2">
                                    <div className="text-sm font-mono p-2 bg-gray-100 rounded w-full">{wallet.address}</div>
                                    <button 
                                        className="flex items-center justify-center text-sm bg-red-500 w-8 h-8 rounded"
                                        onClick={() => {
                                            console.log('Wallet supprimé');
                                        }}
                                    >
                                        <Trash2 stroke="white"/>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 font-mono">Aucun wallet connecté</p>
                )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Wallet"
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value)}
                    className="w-full p-2 border rounded font-mono"
                />
                <button type="submit" className="w-full bg-primary text-white p-2 rounded font-mono">
                    Add a Wallet
                </button>
            </form>

           
        </div>
    );
};

export default Profile;