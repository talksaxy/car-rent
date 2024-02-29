/*
  Warnings:

  - You are about to alter the column `lama_sewa` on the `rent` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `rent` MODIFY `lama_sewa` INTEGER NOT NULL DEFAULT 0;
