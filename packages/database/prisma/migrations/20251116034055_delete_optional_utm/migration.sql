/*
  Warnings:

  - You are about to drop the column `utmContent` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `utmMedium` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `utmSource` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `utmTerm` on the `Campaign` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "utmContent",
DROP COLUMN "utmMedium",
DROP COLUMN "utmSource",
DROP COLUMN "utmTerm";
