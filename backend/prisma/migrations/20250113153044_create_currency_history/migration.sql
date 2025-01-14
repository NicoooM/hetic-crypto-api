/*
  Warnings:

  - You are about to drop the column `date` on the `Currency` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Currency` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `Wallet` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `WalletHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Currency" DROP COLUMN "date",
DROP COLUMN "price";

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "amount";

-- AlterTable
ALTER TABLE "WalletHistory" ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "CurrencyHistory" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currencyId" INTEGER NOT NULL,

    CONSTRAINT "CurrencyHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CurrencyHistory" ADD CONSTRAINT "CurrencyHistory_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
