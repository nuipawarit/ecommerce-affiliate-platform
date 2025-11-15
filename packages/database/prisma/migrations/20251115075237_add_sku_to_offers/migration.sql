-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "sku" TEXT;

-- CreateIndex
CREATE INDEX "Offer_sku_idx" ON "Offer"("sku");
