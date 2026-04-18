/**
 * Script para criar usuário admin inicial
 */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function createAdmin() {
  const SALT_ROUNDS = 12;

  try {
    console.log("🔧 Criando usuário admin...");

    // Verificar se já existe um admin
    const existingAdmin = await prisma.user.findFirst({
      where: { tipo: "ADMIN" },
    });

    if (existingAdmin) {
      console.log("✅ Admin já existe:", existingAdmin.email);
      return;
    }

    // Criar admin
    const password_hash = await bcrypt.hash("admin123", SALT_ROUNDS);

    const admin = await prisma.user.create({
      data: {
        nome: "Administrador TwalaCare",
        email: "admin@twalacare.local",
        password_hash,
        telefone: "999999999",
        tipo: "ADMIN",
        status: "ATIVO",
      },
    });

    console.log("✅ Admin criado com sucesso!");
    console.log("📧 Email:", admin.email);
    console.log("🔑 Senha: admin123");
    console.log("⚠️  IMPORTANTE: Altere a senha após o primeiro login!");
  } catch (error) {
    console.error("❌ Erro ao criar admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
