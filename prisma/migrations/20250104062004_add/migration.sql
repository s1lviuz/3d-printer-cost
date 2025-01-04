/*
  Warnings:

  - Added the required column `cost` to the `Filament` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Filament" ADD COLUMN     "cost" DOUBLE PRECISION NOT NULL;
