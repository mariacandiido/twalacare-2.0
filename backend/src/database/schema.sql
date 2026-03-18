-- ============================================================
-- Script SQL completo para criação do esquema MySQL - ProjectoMC
-- Pode ser executado manualmente ou usar as migrations (npm run migrate)
-- ============================================================

CREATE DATABASE IF NOT EXISTS twalacare CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE twalacare;

-- Utilizadores (cliente, farmacia, entregador, admin)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(180) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  telefone VARCHAR(30) NULL,
  tipo ENUM('cliente','farmacia','entregador','admin') NOT NULL,
  status ENUM('ativo','inativo','suspenso','pendente_aprovacao') DEFAULT 'ativo',
  data_nascimento DATE NULL,
  provincia VARCHAR(80) NULL,
  municipio VARCHAR(80) NULL,
  endereco VARCHAR(255) NULL,
  veiculo VARCHAR(50) NULL,
  placa_veiculo VARCHAR(20) NULL,
  cargo VARCHAR(80) NULL,
  departamento VARCHAR(80) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_users_email (email),
  KEY idx_users_tipo_status (tipo, status)
) ENGINE=InnoDB;

-- Farmácias (1:1 com user quando tipo=farmacia)
CREATE TABLE farmacias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  nome VARCHAR(150) NOT NULL,
  nif VARCHAR(30) NULL,
  licenca_funcionamento VARCHAR(80) NULL,
  provincia VARCHAR(80) NULL,
  municipio VARCHAR(80) NULL,
  bairro VARCHAR(80) NULL,
  rua VARCHAR(120) NULL,
  num_edificio VARCHAR(20) NULL,
  horario_abertura VARCHAR(10) NULL,
  horario_fechamento VARCHAR(10) NULL,
  farmaceutico_nome VARCHAR(120) NULL,
  farmaceutico_cedula VARCHAR(40) NULL,
  farmaceutico_tel VARCHAR(30) NULL,
  avaliacao DECIMAL(3,2) DEFAULT 0,
  aprovada TINYINT(1) DEFAULT 0,
  data_aprovacao DATE NULL,
  rejeitada TINYINT(1) DEFAULT 0,
  motivo_rejeicao TEXT NULL,
  image_url VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_farmacias_user_id (user_id),
  KEY idx_farmacias_aprovada (aprovada, rejeitada),
  CONSTRAINT fk_farmacias_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- Medicamentos
CREATE TABLE medicamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farmacia_id INT NOT NULL,
  nome VARCHAR(150) NOT NULL,
  categoria VARCHAR(80) NULL,
  descricao TEXT NULL,
  preco DECIMAL(12,2) NOT NULL,
  stock INT DEFAULT 0,
  requires_prescription TINYINT(1) DEFAULT 0,
  image_url VARCHAR(500) NULL,
  provincia VARCHAR(80) NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  horario VARCHAR(50) NULL,
  ativo TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_medicamentos_farmacia (farmacia_id),
  KEY idx_medicamentos_nome (nome),
  CONSTRAINT fk_medicamentos_farmacia FOREIGN KEY (farmacia_id) REFERENCES farmacias(id)
) ENGINE=InnoDB;

-- Pedidos
CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  taxa_entrega DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(12,2) NOT NULL,
  status ENUM('pendente','confirmado','em_preparacao','pronto','em_transito','entregue','cancelado') DEFAULT 'pendente',
  metodo_pagamento VARCHAR(80) NULL,
  endereco_entrega VARCHAR(255) NULL,
  data_entrega_estimada DATE NULL,
  data_entrega DATE NULL,
  data_pedido TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_pedidos_cliente (cliente_id),
  KEY idx_pedidos_status (status),
  CONSTRAINT fk_pedidos_cliente FOREIGN KEY (cliente_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- Itens do pedido
CREATE TABLE pedido_itens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  medicamento_id INT NOT NULL,
  farmacia_id INT NOT NULL,
  nome VARCHAR(150) NOT NULL,
  preco_unitario DECIMAL(12,2) NOT NULL,
  quantidade INT NOT NULL,
  requires_prescription TINYINT(1) DEFAULT 0,
  CONSTRAINT fk_pi_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  CONSTRAINT fk_pi_medicamento FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id),
  CONSTRAINT fk_pi_farmacia FOREIGN KEY (farmacia_id) REFERENCES farmacias(id)
) ENGINE=InnoDB;

-- Entregas
CREATE TABLE entregas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  entregador_id INT NULL,
  status ENUM('disponivel','aceito','coletando','em_transito','entregue','cancelado') DEFAULT 'disponivel',
  valor_entrega DECIMAL(10,2) DEFAULT 0,
  distancia_km DECIMAL(8,2) NULL,
  tempo_estimado_min INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_entregas_pedido (pedido_id),
  KEY idx_entregas_status (status),
  CONSTRAINT fk_entregas_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  CONSTRAINT fk_entregas_entregador FOREIGN KEY (entregador_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- Receitas
CREATE TABLE receitas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  pedido_id INT NULL,
  farmacia_id INT NULL,
  ficheiro_url VARCHAR(500) NULL,
  nome_ficheiro VARCHAR(255) NULL,
  estado ENUM('pendente','aprovada','rejeitada') DEFAULT 'pendente',
  observacoes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_receitas_cliente FOREIGN KEY (cliente_id) REFERENCES users(id),
  CONSTRAINT fk_receitas_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  CONSTRAINT fk_receitas_farmacia FOREIGN KEY (farmacia_id) REFERENCES farmacias(id)
) ENGINE=InnoDB;

-- Refresh tokens (JWT)
CREATE TABLE refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(500) NOT NULL,
  expires_at DATETIME NOT NULL,
  revoked TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_refresh_tokens_token (token(255)),
  CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;
