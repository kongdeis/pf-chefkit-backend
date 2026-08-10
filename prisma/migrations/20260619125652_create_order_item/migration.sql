-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_mealkitId_fkey";

-- DropIndex
DROP INDEX "Order_mealkitId_idx";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "mealkitId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,
    "mealkitId" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_mealkitId_idx" ON "OrderItem"("mealkitId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_mealkitId_fkey" FOREIGN KEY ("mealkitId") REFERENCES "Mealkit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_mealkitId_fkey" FOREIGN KEY ("mealkitId") REFERENCES "Mealkit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
