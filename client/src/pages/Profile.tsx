import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import API from "services/api";

interface Wallet {
  userId: number;
  id: number;
  address: string;
  title: string;
}

const Profile = () => {
  const [wallet, setWallet] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [wallets, setWallets] = useState<Wallet[]>([]); // Ajout de 'title' au type
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPassWordConfirmation, setNewPasswordConfirmation] =
    useState<string>("");

  useEffect(() => {
    fetchWallets();
  }, []);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchWallets = async () => {
    try {
      const response = await API.get("/wallet");
      const wallets: Wallet[] = response.data;
      setWallets(wallets);
    } catch (e) {
      setError("Erreur lors de la récupération des wallets");
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await API.get("/profile");
      const profile: { email: string; name: string } = response.data;
      const { email, name } = profile;
      setName(name);
      setEmail(email);
    } catch (e) {
      setError("Erreur lors de la récupération du profil");
    }
  };

  const createWallet = async () => {
    try {
      const response = await API.post("/wallet", {
        address: wallet,
        title,
      });

      if (response.status === 201) {
        setError("Wallet ajouté avec succès!");
        setWallet("");
        setTitle("");
        await fetchWallets();
      }
    } catch (err) {
      setError("Erreur lors de la création du wallet");
    }
  };

  const deleteWallet = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/wallet/${id}`, {
        method: "DELETE",
      });

      if (response.status === 200) {
        setError("Wallet supprimé avec succès!");
        await fetchWallets();
      }
    } catch (err) {
      setError("Erreur lors de la suppression du wallet");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createWallet();
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await API.patch("/profile", {
        name,
        email,
      });

      if (response.status === 200) {
        const data = response.data;
        setError("Profil mis à jour avec succès!");
        setName(data.name || name);
        setEmail(data.email || email);
        // setPassword("");
      } else {
        throw new Error("Erreur lors de la mise à jour du profil");
      }
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil");
    }
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== newPassWordConfirmation) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await API.patch("/profile/password", {
        password,
        newPassword,
      });

      if (response.status === 200) {
        setError("Mot de passe mis à jour avec succès!");
        setPassword("");
        setNewPassword("");
        setNewPasswordConfirmation("");
      }
    } catch (err: any) {
      let errorMessage = "Password update failed.";

      try {
        JSON.parse(err.response?.data?.message);

        errorMessage =
          JSON.parse(err.response?.data?.message)[0]?.message ||
          "Password update failed.";
      } catch (e) {
        errorMessage = err.response?.data?.message || errorMessage;
      }

      setError(errorMessage);
    }
  };

  return (
    <div className="max-w-screen-md my-10 mx-auto p-4 space-y-4 bg-white border border-gray-200 rounded-lg">
      {error && (
        <div
          className={`${
            error.includes("succès") ? "text-green-500" : "text-red-500"
          }`}
        >
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
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white p-2 mt-4 rounded font-mono"
          >
            Update the informations
          </button>
        </form>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold font-mono mb-4">Password</h2>
        <form onSubmit={updatePassword}>
          <div className="flex flex-row justify-between gap-2">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-sm font-mono p-2 bg-gray-100 rounded w-full"
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="text-sm font-mono p-2 bg-gray-100 rounded w-full"
            />
            <input
              type="password"
              placeholder="New password confirmation"
              value={newPassWordConfirmation}
              onChange={(e) => setNewPasswordConfirmation(e.target.value)}
              className="text-sm font-mono p-2 bg-gray-100 rounded w-full"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white p-2 mt-4 rounded font-mono"
          >
            Update Password
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
                      <span className="font-bold text-md">{wallet.title}</span>{" "}
                      <span className="text-sm text-gray-500">
                        {wallet.address}
                      </span>
                    </div>
                  </div>
                  <button
                    className="flex items-center justify-center text-sm bg-red-500 w-10 h-10 rounded"
                    onClick={async () => {
                      console.log("Wallet supprimé");
                      await deleteWallet(wallet.id);
                    }}
                  >
                    <Trash2 stroke="white" />
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
        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded font-mono"
        >
          Add a wallet
        </button>
      </form>
    </div>
  );
};

export default Profile;
