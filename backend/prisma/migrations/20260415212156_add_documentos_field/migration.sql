-- AlterTable
ALTER TABLE `farmacias` ADD COLUMN `documentos` JSON NULL;

-- AlterTable
ALTER TABLE `refresh_tokens` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `users` ADD COLUMN `documentos` JSON NULL;

-- CreateTable
CREATE TABLE `admin_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `admin_id` INTEGER NOT NULL,
    `acao` VARCHAR(100) NOT NULL,
    `tipo_alvo` VARCHAR(50) NOT NULL,
    `id_alvo` INTEGER NOT NULL,
    `descricao` VARCHAR(255) NOT NULL,
    `detalhes` TEXT NOT NULL,
    `ip_address` VARCHAR(50) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `medicamentos_farmacia_id_categoria_id_idx` ON `medicamentos`(`farmacia_id`, `categoria_id`);

-- CreateIndex
CREATE INDEX `pedidos_cliente_id_endereco_id_status_idx` ON `pedidos`(`cliente_id`, `endereco_id`, `status`);

-- AddForeignKey
ALTER TABLE `admin_logs` ADD CONSTRAINT `admin_logs_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RedefineIndex
CREATE INDEX `enderecos_user_id_idx` ON `enderecos`(`user_id`);
DROP INDEX `enderecos_user_id_fkey` ON `enderecos`;
