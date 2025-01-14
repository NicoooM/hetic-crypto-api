/*
  Warnings:

  - A unique constraint covering the columns `[date,currencyId]` on the table `CurrencyHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CurrencyHistory_date_currencyId_key" ON "CurrencyHistory"("date", "currencyId");
