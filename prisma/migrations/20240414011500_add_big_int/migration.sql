/*
  Warnings:

  - You are about to alter the column `event_time` on the `Records` table. The data in that column could be lost. The data in that column will be cast from `VarChar(14)` to `BigInt`.

*/
-- AlterTable
ALTER TABLE `Records` MODIFY `event_time` BIGINT NOT NULL;
