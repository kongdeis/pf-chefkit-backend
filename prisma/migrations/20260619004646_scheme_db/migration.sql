/*
  Warnings:

  - You are about to alter the column `name` on the `Ingredient` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `location` on the `Ingredient` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `name` on the `Mealkit` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `description` on the `Mealkit` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `Member` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `email` on the `Member` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `address` on the `Member` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `phone` on the `Member` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.

*/
-- AlterTable
ALTER TABLE "Ingredient" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "location" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Mealkit" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Member" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "address" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(20);
