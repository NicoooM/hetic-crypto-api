import React, { useState, useEffect } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  price: number;
  fees: number;
  date: Date;
}

const fakeTransactions: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    amount: 1,
    price: 30000,
    fees: 50,
    date: new Date('2024-01-15')
  },
  {
    id: '2',
    type: 'deposit',
    amount: 0.5,
    price: 35000,
    fees: 25,
    date: new Date('2024-02-01')
  },
  {
    id: '3',
    type: 'withdraw',
    amount: 0.3,
    price: 40000,
    fees: 30,
    date: new Date('2024-03-01')
  },
  {
    id: '4',
    type: 'deposit',
    amount: 2,
    price: 32000,
    fees: 40,
    date: new Date('2024-01-20')
  },
  {
    id: '5',
    type: 'withdraw',
    amount: 1.5,
    price: 31000,
    fees: 20,
    date: new Date('2024-02-15')
  },
  {
    id: '6',
    type: 'deposit',
    amount: 0.8,
    price: 33000,
    fees: 15,
    date: new Date('2024-03-10')
  },
  {
    id: '7',
    type: 'withdraw',
    amount: 0.4,
    price: 34000,
    fees: 35,
    date: new Date('2024-03-20')
  },
  {
    id: '8',
    type: 'deposit',
    amount: 1.2,
    price: 36000,
    fees: 10,
    date: new Date('2024-04-01')
  },
  {
    id: '9',
    type: 'withdraw',
    amount: 0.6,
    price: 37000,
    fees: 45,
    date: new Date('2024-04-10')
  },
  {
    id: '10',
    type: 'deposit',
    amount: 1.5,
    price: 38000,
    fees: 60,
    date: new Date('2024-04-15')
  },
  {
    id: '11',
    type: 'withdraw',
    amount: 0.9,
    price: 39000,
    fees: 55,
    date: new Date('2024-04-20')
  },
  {
    id: '12',
    type: 'deposit',
    amount: 0.7,
    price: 40000,
    fees: 20,
    date: new Date('2024-05-01')
  }
];

const Fiscalite = () => {
  const [transactions] = useState<Transaction[]>(fakeTransactions);
  const [portfolioValue, setPortfolioValue] = useState<number>(0);

  useEffect(() => {
    // Calculer la valeur totale du portefeuille
    const value = transactions.reduce((total, t) => {
      if (t.type === 'deposit') {
        return total + (t.amount * t.price);
      } else {
        return total - (t.amount * t.price);
      }
    }, 0);
    setPortfolioValue(value);
  }, [transactions]);

  const calculateTaxableGain = (transaction: Transaction) => {
    if (transaction.type !== 'withdraw') return 0;

    const Pc = transaction.amount * transaction.price; // Prix de cession
    const PaT = portfolioValue; // Valeur totale du portefeuille
    const V = portfolioValue + Pc; // Valeur totale au moment de la vente
    const F = transaction.fees; // Frais

    // PV = Pc - (PaT * Pc/V) - F
    const taxableGain = Pc - (PaT * (Pc / V)) - F;
    return taxableGain;
  };

  const calculateTotalGains = () => {
    return transactions
      .filter(t => t.type === 'withdraw')
      .reduce((total, t) => total + calculateTaxableGain(t), 0);
  };

  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const totalGains = calculateTotalGains();
    const taxableAmount = totalGains * 0.30; // 30% des plus-values

    page.drawText('Rapport des Plus-Values Crypto', {
      x: 50,
      y: page.getHeight() - 50,
      size: 20,
      font,
      color: rgb(0, 0, 0),
    });

    let yPosition = page.getHeight() - 100;

    // En-tête
    page.drawText('Date', { x: 50, y: yPosition, size: fontSize, font });
    page.drawText('Type', { x: 150, y: yPosition, size: fontSize, font });
    page.drawText('Montant', { x: 220, y: yPosition, size: fontSize, font });
    page.drawText('Prix', { x: 320, y: yPosition, size: fontSize, font });
    page.drawText('Frais', { x: 400, y: yPosition, size: fontSize, font });
    page.drawText('Plus-Value', { x: 500, y: yPosition, size: fontSize, font });

    yPosition -= 20;

    transactions.forEach((transaction) => {
      const gain = calculateTaxableGain(transaction);

      yPosition -= 20;
      page.drawText(transaction.date.toLocaleDateString(), { x: 50, y: yPosition, size: fontSize, font });
      page.drawText(transaction.type, { x: 150, y: yPosition, size: fontSize, font });
      page.drawText(transaction.amount.toString(), { x: 220, y: yPosition, size: fontSize, font });
      page.drawText(transaction.price.toString() + '€', { x: 320, y: yPosition, size: fontSize, font });
      page.drawText(transaction.fees.toString() + '€', { x: 400, y: yPosition, size: fontSize, font });
      page.drawText(gain.toFixed(2) + '€', { x: 500, y: yPosition, size: fontSize, font });
    });

    yPosition -= 40;
    
    // Résumé des calculs
    page.drawText('Résumé fiscal:', { 
      x: 50, 
      y: yPosition, 
      size: 14, 
      font,
      color: rgb(0, 0, 0),
    });

    yPosition -= 25;
    page.drawText(`Plus-Value Totale: ${totalGains.toFixed(2)}€`, {
      x: 50,
      y: yPosition,
      size: 12,
      font,
    });

    yPosition -= 20;
    page.drawText(`Montant imposable (30%): ${taxableAmount.toFixed(2)}€`, {
      x: 50,
      y: yPosition,
      size: 12,
      font,
      color: rgb(0.7, 0, 0), // Rouge foncé pour mettre en évidence
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  return (
    <div className="min-h-[calc(100vh-60px)] w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] p-8">
      <div className="mx-auto bg-white rounded-lg p-8 border border-gray-200">
        <h1 className="text-2xl font-bold font-mono mb-10">Calcul de Plus-Value Crypto</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 font-mono">Transactions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Montant</th>
                  <th className="px-4 py-2">Prix</th>
                  <th className="px-4 py-2">Frais</th>
                  <th className="px-4 py-2">Plus-value</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b">
                    <td className="px-4 py-2">{t.date.toLocaleDateString()}</td>
                    <td className="px-4 py-2">{t.type}</td>
                    <td className="px-4 py-2">{t.amount}</td>
                    <td className="px-4 py-2">{t.price}€</td>
                    <td className="px-4 py-2">{t.fees}€</td>
                    <td className="px-4 py-2">
                      {t.type === 'withdraw' ? `${calculateTaxableGain(t).toFixed(2)}€` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="font-semibold">Plus-value totale: {calculateTotalGains().toFixed(2)}€</p>
            <p className="font-semibold text-red-700">
              Montant imposable (30%): {(calculateTotalGains() * 0.30).toFixed(2)}€
            </p>
          </div>
        </div>

        <div className="mt-8 text-right">
          <button 
            onClick={generatePDF}
            className="bg-primary text-white px-6 py-3 rounded-md text-lg"
          >
            Générer le PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Fiscalite;
