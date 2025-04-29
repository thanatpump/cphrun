/*
  Warnings:

  - You are about to drop the column `shippingAddress` on the `Registration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Registration` DROP COLUMN `shippingAddress`,
    ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `district` VARCHAR(191) NULL,
    ADD COLUMN `postalCode` VARCHAR(191) NULL,
    ADD COLUMN `province` VARCHAR(191) NULL,
    ADD COLUMN `subDistrict` VARCHAR(191) NULL;
