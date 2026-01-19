/*
  Warnings:

  - A unique constraint covering the columns `[name,slug]` on the table `portfolios` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "portfolios_name_slug_key" ON "portfolios"("name", "slug");
