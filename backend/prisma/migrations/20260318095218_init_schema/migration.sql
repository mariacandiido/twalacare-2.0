-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(150) NOT NULL,
    `email` VARCHAR(180) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `telefone` VARCHAR(30) NULL,
    `tipo` ENUM('CLIENTE', 'FARMACIA', 'ENTREGADOR', 'ADMIN') NOT NULL,
    `status` ENUM('ATIVO', 'INATIVO', 'SUSPENSO', 'PENDENTE_APROVACAO') NOT NULL DEFAULT 'ATIVO',
    `data_nascimento` DATETIME(3) NULL,
    `veiculo` VARCHAR(50) NULL,
    `placa_veiculo` VARCHAR(20) NULL,
    `cargo` VARCHAR(80) NULL,
    `departamento` VARCHAR(80) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `enderecos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `provincia` VARCHAR(80) NOT NULL,
    `municipio` VARCHAR(80) NOT NULL,
    `bairro` VARCHAR(80) NULL,
    `rua` VARCHAR(120) NULL,
    `num_edificio` VARCHAR(20) NULL,
    `codigo_postal` VARCHAR(20) NULL,
    `referencia` VARCHAR(255) NULL,
    `latitude` DECIMAL(10, 8) NULL,
    `longitude` DECIMAL(11, 8) NULL,
    `is_padrao` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `farmacias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `endereco_id` INTEGER NULL,
    `nome` VARCHAR(150) NOT NULL,
    `nif` VARCHAR(30) NULL,
    `licenca_funcionamento` VARCHAR(80) NULL,
    `horario_abertura` VARCHAR(10) NULL,
    `horario_fechamento` VARCHAR(10) NULL,
    `farmaceutico_nome` VARCHAR(120) NULL,
    `farmaceutico_cedula` VARCHAR(40) NULL,
    `farmaceutico_tel` VARCHAR(30) NULL,
    `avaliacao` DECIMAL(3, 2) NOT NULL DEFAULT 0,
    `aprovada` BOOLEAN NOT NULL DEFAULT false,
    `data_aprovacao` DATETIME(3) NULL,
    `rejeitada` BOOLEAN NOT NULL DEFAULT false,
    `motivo_rejeicao` VARCHAR(191) NULL,
    `image_url` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `farmacias_user_id_key`(`user_id`),
    UNIQUE INDEX `farmacias_endereco_id_key`(`endereco_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categorias_medicamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `descricao` TEXT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `image_url` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `categorias_medicamento_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `medicamentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `farmacia_id` INTEGER NOT NULL,
    `categoria_id` INTEGER NULL,
    `nome` VARCHAR(150) NOT NULL,
    `descricao` TEXT NULL,
    `preco` DECIMAL(12, 2) NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `requires_prescription` BOOLEAN NOT NULL DEFAULT false,
    `image_url` VARCHAR(500) NULL,
    `rating` DECIMAL(3, 2) NOT NULL DEFAULT 0,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pedidos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cliente_id` INTEGER NOT NULL,
    `endereco_id` INTEGER NULL,
    `subtotal` DECIMAL(12, 2) NOT NULL,
    `taxa_entrega` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `total` DECIMAL(12, 2) NOT NULL,
    `status` ENUM('PENDENTE', 'CONFIRMADO', 'EM_PREPARACAO', 'PRONTO', 'EM_TRANSITO', 'ENTREGUE', 'CANCELADO') NOT NULL DEFAULT 'PENDENTE',
    `data_entrega_estimada` DATETIME(3) NULL,
    `data_entrega` DATETIME(3) NULL,
    `data_pedido` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pagamentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pedido_id` INTEGER NOT NULL,
    `metodo_pagamento` ENUM('MULTICAIXA_EXPRESS', 'TRANSFERENCIA_BANCARIA', 'TPA_NA_ENTREGA', 'DINHEIRO_NA_ENTREGA', 'CARTEIRA_DIGITAL') NOT NULL,
    `status` ENUM('PENDENTE', 'CONCLUIDO', 'FALHOU', 'REEMBOLSADO') NOT NULL DEFAULT 'PENDENTE',
    `valor` DECIMAL(12, 2) NOT NULL,
    `transacao_id` VARCHAR(100) NULL,
    `comprovativo_url` VARCHAR(500) NULL,
    `data_pagamento` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `pagamentos_pedido_id_key`(`pedido_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historico_pedidos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pedido_id` INTEGER NOT NULL,
    `status_anterior` ENUM('PENDENTE', 'CONFIRMADO', 'EM_PREPARACAO', 'PRONTO', 'EM_TRANSITO', 'ENTREGUE', 'CANCELADO') NULL,
    `status_novo` ENUM('PENDENTE', 'CONFIRMADO', 'EM_PREPARACAO', 'PRONTO', 'EM_TRANSITO', 'ENTREGUE', 'CANCELADO') NOT NULL,
    `observacao` TEXT NULL,
    `atualizado_por` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pedido_itens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pedido_id` INTEGER NOT NULL,
    `medicamento_id` INTEGER NOT NULL,
    `farmacia_id` INTEGER NOT NULL,
    `nome` VARCHAR(150) NOT NULL,
    `preco_unitario` DECIMAL(12, 2) NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `requires_prescription` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `entregas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pedido_id` INTEGER NOT NULL,
    `entregador_id` INTEGER NULL,
    `status` ENUM('DISPONIVEL', 'ACEITO', 'COLETANDO', 'EM_TRANSITO', 'ENTREGUE', 'CANCELADO') NOT NULL DEFAULT 'DISPONIVEL',
    `valor_entrega` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `distancia_km` DECIMAL(8, 2) NULL,
    `tempo_estimado_min` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `entregas_pedido_id_key`(`pedido_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `receitas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cliente_id` INTEGER NOT NULL,
    `pedido_id` INTEGER NULL,
    `farmacia_id` INTEGER NULL,
    `ficheiro_url` VARCHAR(500) NULL,
    `nome_ficheiro` VARCHAR(255) NULL,
    `estado` ENUM('PENDENTE', 'APROVADA', 'REJEITADA') NOT NULL DEFAULT 'PENDENTE',
    `observacoes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `avaliacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cliente_id` INTEGER NOT NULL,
    `farmacia_id` INTEGER NULL,
    `medicamento_id` INTEGER NULL,
    `pedido_id` INTEGER NULL,
    `rating` TINYINT NOT NULL,
    `comentario` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `avaliacoes_pedido_id_key`(`pedido_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notificacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `titulo` VARCHAR(150) NOT NULL,
    `mensagem` TEXT NOT NULL,
    `tipo` ENUM('SISTEMA', 'PEDIDO', 'RECEITA', 'PAGAMENTO', 'ENTREGA') NOT NULL DEFAULT 'SISTEMA',
    `lida` BOOLEAN NOT NULL DEFAULT false,
    `link_url` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `token` VARCHAR(500) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `revoked` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `enderecos` ADD CONSTRAINT `enderecos_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `farmacias` ADD CONSTRAINT `farmacias_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `farmacias` ADD CONSTRAINT `farmacias_endereco_id_fkey` FOREIGN KEY (`endereco_id`) REFERENCES `enderecos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `medicamentos` ADD CONSTRAINT `medicamentos_farmacia_id_fkey` FOREIGN KEY (`farmacia_id`) REFERENCES `farmacias`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `medicamentos` ADD CONSTRAINT `medicamentos_categoria_id_fkey` FOREIGN KEY (`categoria_id`) REFERENCES `categorias_medicamento`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedidos` ADD CONSTRAINT `pedidos_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedidos` ADD CONSTRAINT `pedidos_endereco_id_fkey` FOREIGN KEY (`endereco_id`) REFERENCES `enderecos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pagamentos` ADD CONSTRAINT `pagamentos_pedido_id_fkey` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historico_pedidos` ADD CONSTRAINT `historico_pedidos_pedido_id_fkey` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historico_pedidos` ADD CONSTRAINT `historico_pedidos_atualizado_por_fkey` FOREIGN KEY (`atualizado_por`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedido_itens` ADD CONSTRAINT `pedido_itens_pedido_id_fkey` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedido_itens` ADD CONSTRAINT `pedido_itens_medicamento_id_fkey` FOREIGN KEY (`medicamento_id`) REFERENCES `medicamentos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedido_itens` ADD CONSTRAINT `pedido_itens_farmacia_id_fkey` FOREIGN KEY (`farmacia_id`) REFERENCES `farmacias`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entregas` ADD CONSTRAINT `entregas_pedido_id_fkey` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entregas` ADD CONSTRAINT `entregas_entregador_id_fkey` FOREIGN KEY (`entregador_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receitas` ADD CONSTRAINT `receitas_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receitas` ADD CONSTRAINT `receitas_pedido_id_fkey` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receitas` ADD CONSTRAINT `receitas_farmacia_id_fkey` FOREIGN KEY (`farmacia_id`) REFERENCES `farmacias`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacoes` ADD CONSTRAINT `avaliacoes_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacoes` ADD CONSTRAINT `avaliacoes_farmacia_id_fkey` FOREIGN KEY (`farmacia_id`) REFERENCES `farmacias`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacoes` ADD CONSTRAINT `avaliacoes_medicamento_id_fkey` FOREIGN KEY (`medicamento_id`) REFERENCES `medicamentos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacoes` ADD CONSTRAINT `avaliacoes_pedido_id_fkey` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notificacoes` ADD CONSTRAINT `notificacoes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
