import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

const Profile = () => {
    const [wallet, setWallet] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [wallets, setWallets] = useState<{ id: number, address: string, userId: number, title: string }[]>([]); // Ajout de 'title' au type
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    useEffect(() => {
        fetchWallets();
    }, []);

    useEffect(() => {
        fetchProfile();
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

    const fetchProfile = async () => {
        try {
            const response = await fetch('http://localhost:8080/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setName(data.name || '');
                setEmail(data.email || '');
            } else {
                throw new Error('Erreur lors de la récupération du profil');
            }
        } catch (err) {
            setError('Erreur lors de la récupération du profil');
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
                    title: title,
                })
            });
            
            if (response.status === 201) {
                setError('Wallet ajouté avec succès!');
                setWallet('');
                setTitle('');
                await fetchWallets();
            }
        } catch (err) {
            setError('Erreur lors de la création du wallet');
        }
    };

    const deleteWallet = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8080/wallet/${id}`, {
                method: 'DELETE',
            });
            
            if (response.status === 200) {
                setError('Wallet supprimé avec succès!');
                await fetchWallets();
            }
        } catch (err) {
            setError('Erreur lors de la suppression du wallet');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createWallet();
    };

    const updateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password: password.trim() ? password : undefined,
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                setError('Profil mis à jour avec succès!');
                setName(data.name || name);
                setEmail(data.email || email);
                setPassword('');
            } else {
                throw new Error('Erreur lors de la mise à jour du profil');
            }
        } catch (err) {
            setError('Erreur lors de la mise à jour du profil');
        }
    };

    return (
        <div className="max-w-screen-md my-10 mx-auto p-4 space-y-4 bg-white border border-gray-200 rounded-lg">
            {error && (
                <div className={`${error.includes('succès') ? 'text-green-500' : 'text-red-500'}`}>
                    {error}
                </div>
            )}
            <h1 className="text-2xl font-bold font-mono">Profile</h1>

            <div className="mt-8">
                <h2 className="text-xl font-bold font-mono mb-4">My informations</h2>
                <form onSubmit={updateProfile}>
                    <div className="flex flex-row justify-between gap-2">
                        <input 
                            type="text" 
                            placeholder="Nom" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="text-sm font-mono p-2 bg-gray-100 rounded w-full"
                        />
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="text-sm font-mono p-2 bg-gray-100 rounded w-full"
                        />
                        <input 
                            type="password" 
                            placeholder="Nouveau mot de passe" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="text-sm font-mono p-2 bg-gray-100 rounded w-full"
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary text-white p-2 mt-4 rounded font-mono">
                        Update the informations
                    </button>
                </form>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold font-mono mb-4">My wallets</h2>
                {wallets.length > 0 ? (
                    <ul className="space-y-2">
                        {wallets.map((wallet) => (
                            <li key={wallet.id} className="">
                                <div className="flex flex-row justify-between gap-2">
                                    <div className="w-full">
                                        <div className="font-mono p-2 bg-gray-100 rounded w-full flex flex-row items-baseline gap-4">
                                           <span className="font-bold text-md">{wallet.title}</span> <span className="text-sm text-gray-500">{wallet.address}</span>
                                        </div>
                                        
                                    </div>
                                    <button 
                                        className="flex items-center justify-center text-sm bg-red-500 w-10 h-10 rounded"
                                        onClick={async () => {
                                            console.log('Wallet supprimé');
                                            await deleteWallet(wallet.id);
                                        }}
                                    >
                                        <Trash2 stroke="white"/>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 font-mono">No wallet connected</p>
                )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-row justify-between gap-2">
                <input
                    type="text"
                    placeholder="Wallet title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded font-mono"
                    required
                />
                <input
                    type="text"
                    placeholder="Wallet address"
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value)}
                    className="w-full p-2 border rounded font-mono"
                    required
                />
                </div>
                <button type="submit" className="w-full bg-primary text-white p-2 rounded font-mono">
                    Add a wallet
                </button>
            </form>

           
        </div>
    );
};

export default Profile;