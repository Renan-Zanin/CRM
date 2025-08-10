-- Migração segura para adicionar sistema de caixa
-- Esta migração adiciona apenas as novas tabelas sem afetar os dados existentes

-- CreateTable CashRegister
CREATE TABLE IF NOT EXISTS `CashRegister` (
    `id` VARCHAR(191) NOT NULL,
    `storeId` VARCHAR(191) NOT NULL,
    `openingAmount` DOUBLE NOT NULL,
    `openingDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `closingDate` DATETIME(3) NULL,
    `closingAmount` DOUBLE NULL,
    `totalIncoming` DOUBLE NOT NULL DEFAULT 0,
    `totalOutgoing` DOUBLE NOT NULL DEFAULT 0,
    `profit` DOUBLE NULL,
    `isOpen` BOOLEAN NOT NULL DEFAULT true,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    INDEX `CashRegister_storeId_idx`(`storeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable CashTransaction
CREATE TABLE IF NOT EXISTS `CashTransaction` (
    `id` VARCHAR(191) NOT NULL,
    `cashRegisterId` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `paymentMethod` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `CashTransaction_cashRegisterId_idx`(`cashRegisterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
