# Crypto Taxation FAQ

This FAQ addresses common questions on how crypto capital gains ("plus-value") and their taxation are handled in the Hetic Crypto API app.

---

## How are crypto capital gains ("plus-values") calculated?

In the **Fiscalité** page, capital gains are computed for each withdrawal ("withdraw") using the following formula:

```
PV = Pc - (PaT * Pc / V) - F
```

- **PV:** Plus-value (taxable gain)
- **Pc:** Sale price of the withdrawn amount (`amount * price`)
- **PaT:** Total portfolio value at time of withdrawal
- **V:** Portfolio value after adding sale proceeds (`portfolioValue + Pc`)
- **F:** Fees for the transaction

Only withdrawals generate capital gains. Deposits are not taxable events.

**Example Calculation:**

Suppose you withdraw 0.6 BTC at €37,000 with €45 fees and your portfolio value is €120,000:

```txt
Pc = 0.6 * 37,000 = 22,200€
PaT = 120,000€
V = 120,000 + 22,200 = 142,200€
F = 45€

PV = 22,200 - (120,000 * 22,200 / 142,200) - 45
```

---

## What is displayed in the Fiscalité page?

- **Transaction Table:** Lists all deposits and withdrawals, showing date, type, amount, price, fees, and calculated plus-value (when applicable).
- **Total Capital Gain:** Sums all plus-values from withdrawals.
- **Taxable Amount:** Automatically displays 30% of your total gains, which corresponds to the default crypto capital gains tax rate in France.

---

## How can I export my tax report?

Click the **"Générer le PDF"** button. This will create a PDF summary including all transactions, their gains, and a summary of taxable amounts.

---

## Why are deposits not taxed?

Cryptocurrency deposits are not considered taxable events until you "realize" a gain, typically by withdrawing or selling for fiat or other assets. Only withdrawals ("withdraw" type) trigger a capital gains calculation.

---

## Can I use my own transaction history?

Currently, the Fiscalité page uses predefined transaction data. For real data integration or connecting to your account, check for future updates or interface with your own API.

---

## How is the taxable gain taxed?

The taxable gain is calculated using the above formula for each withdrawal, and the total taxable amount is **30%** of total gains, in line with French fiscal policy for crypto assets. This rate is for informational purposes only; please verify the latest requirements from local tax authorities.

---

## Example: How to read the transactions table

| Date        | Type     | Amount | Price    | Fees | Plus-Value |
| ----------- | -------- | ------ | -------- | ---- | ---------- |
| 2024-03-01  | withdraw | 0.3    | 40,000€  | 30€  | 482.75€    |

Here, you see for each withdrawal the calculated gain (plus-value). This value is used to compute your tax summary.

---

_For more details or future features, please refer to the official [documentation](../) or contact support._