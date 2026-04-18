/**
 * Seed script para popular dados iniciais necessários para a plataforma.
 * Cria categorias de medicamentos dinamicamente a partir do banco de dados.
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categorias = [
  { nome: 'Analgésicos', descricao: 'Medicamentos para alívio de dor', ativo: true },
  { nome: 'Antibióticos', descricao: 'Medicamentos para combate a infecções bacterianas', ativo: true },
  { nome: 'Antiinflamatórios', descricao: 'Medicamentos para redução de inflamações', ativo: true },
  { nome: 'Anti-hipertensivos', descricao: 'Medicamentos para controlo da pressão arterial', ativo: true },
  { nome: 'Antigripais', descricao: 'Medicamentos para gripe e constipações', ativo: true },
  { nome: 'Antiparasitários', descricao: 'Medicamentos antiparasitários e desparasitantes', ativo: true },
  { nome: 'Antimaláricos', descricao: 'Medicamentos para malária', ativo: true },
  { nome: 'Vitaminas e Suplementos', descricao: 'Vitaminas, minerais e suplementos nutricionais', ativo: true },
  { nome: 'Dermatológicos', descricao: 'Medicamentos para pele', ativo: true },
  { nome: 'Oftalmológicos', descricao: 'Colírios e medicamentos para olhos', ativo: true },
  { nome: 'Antidiabéticos', descricao: 'Medicamentos para controlo da diabetes', ativo: true },
  { nome: 'Psicotrópicos', descricao: 'Medicamentos de controlo psiquiátrico', ativo: true },
];

async function main() {
  console.log('🌱 A iniciar seed da base de dados...');

  for (const categoria of categorias) {
    await prisma.categoriaMedicamento.upsert({
      where: { nome: categoria.nome },
      update: {},
      create: categoria,
    });
  }

  console.log(`✅ ${categorias.length} categorias criadas/verificadas com sucesso!`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
