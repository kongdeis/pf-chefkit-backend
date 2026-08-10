-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'CHEF', 'ADMIN');

-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('EA', 'G1', 'G10', 'G100', 'KG1');

-- CreateTable
CREATE TABLE "Member" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "unit" "Unit" NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mealkit" (
    "id" SERIAL NOT NULL,
    "chefId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "recipe" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "orderCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mealkit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealkitIngredient" (
    "mealkitId" INTEGER NOT NULL,
    "ingredientId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "MealkitIngredient_pkey" PRIMARY KEY ("mealkitId","ingredientId")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "mealkitId" INTEGER NOT NULL,
    "orderedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Member_uuid_key" ON "Member"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_name_location_key" ON "Ingredient"("name", "location");

-- CreateIndex
CREATE INDEX "Mealkit_chefId_idx" ON "Mealkit"("chefId");

-- CreateIndex
CREATE INDEX "Order_memberId_idx" ON "Order"("memberId");

-- CreateIndex
CREATE INDEX "Order_mealkitId_idx" ON "Order"("mealkitId");

-- AddForeignKey
ALTER TABLE "Mealkit" ADD CONSTRAINT "Mealkit_chefId_fkey" FOREIGN KEY ("chefId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealkitIngredient" ADD CONSTRAINT "MealkitIngredient_mealkitId_fkey" FOREIGN KEY ("mealkitId") REFERENCES "Mealkit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealkitIngredient" ADD CONSTRAINT "MealkitIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_mealkitId_fkey" FOREIGN KEY ("mealkitId") REFERENCES "Mealkit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
