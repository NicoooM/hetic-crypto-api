import React, { useState } from 'react';

interface TransactionFormProps {
  onAddTransaction: (transaction: Transaction) => void;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  price: number;
  fees: number;
  date: Date;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const [formData, setFormData] = useState({
    type: 'deposit',
    amount: '',
    price: '',
    fees: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTransaction({
      id: Date.now().toString(),
      type: formData.type as 'deposit' | 'withdraw',
      amount: Number(formData.amount),
      price: Number(formData.price),
      fees: Number(formData.fees),
      date: new Date(formData.date)
    });
    setFormData({
      type: 'deposit',
      amount: '',
      price: '',
      fees: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="deposit">Dépôt</option>
          <option value="withdraw">Retrait</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Montant</label>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Prix unitaire</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Frais</label>
        <input
          type="number"
          value={formData.fees}
          onChange={(e) => setFormData({...formData, fees: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-primary text-white px-4 py-2 rounded-md"
      >
        Ajouter la transaction
      </button>
    </form>
  );
}; 