const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/apiResponse');

/**
 * Controller para dados públicos (acessíveis sem login)
 */

exports.getFarmacias = catchAsync(async (req, res) => {
  const { provincia, municipio } = req.query;
  
  const farmacias = await prisma.user.findMany({
    where: {
      tipo: 'FARMACIA',
      status: 'ativo',
      ...(provincia && { provincia }),
      ...(municipio && { municipio }),
    },
    select: {
      id: true,
      nome: true,
      email: true,
      telefone: true,
      provincia: true,
      municipio: true,
      endereco: true,
      horarioAbertura: true,
      horarioFechamento: true,
      // Simulando campos que virão de avaliações futuramente
      // No schema real, estas relações devem ser somadas/medias
    }
  });

  // Mapear para o formato esperado pelo frontend (adicionando campos calculados/mockados por enquanto onde não há no schema)
  const formatted = farmacias.map(f => ({
    ...f,
    rating: 4.5, // Mock até implementar sistema de avaliações real
    deliveryTime: "20-40 min",
    image: "https://images.unsplash.com/photo-1765031092161-a9ebe556117e?w=400",
    products: 0, // Poderia ser um count de medicamentos
    isOpen: true,
  }));

  ApiResponse.success(res, 'Lista de farmácias parceiras', formatted);
});

exports.getMedicamentos = catchAsync(async (req, res) => {
  const { q, categoria, farmaciaId, provincia } = req.query;

  const medicamentos = await prisma.medicamento.findMany({
    where: {
      nome: { contains: q || '' },
      ...(categoria && { categoria: { nome: categoria } }),
      ...(farmaciaId && { farmaciaId }),
      ...(provincia && { farmacia: { provincia } }),
    },
    include: {
      farmacia: {
        select: { nome: true, provincia: true }
      },
      categoria: true
    }
  });

  const formatted = medicamentos.map(m => ({
    id: m.id,
    name: m.nome,
    nome: m.nome,
    price: Number(m.preco),
    farmacia: m.farmacia.nome,
    farmaciaId: m.farmaciaId,
    provincia: m.farmacia.provincia,
    categoria: m.categoria?.nome || 'Geral',
    image: m.imagem || "https://images.unsplash.com/photo-1646392206581-2527b1cae5cb?w=400",
    rating: 4.7,
    stock: m.estoque,
    requiresPrescription: m.requerReceita,
  }));

  ApiResponse.success(res, 'Catálogo de medicamentos', formatted);
});

exports.getCategorias = catchAsync(async (req, res) => {
  const categorias = await prisma.categoriaMedicamento.findMany();
  ApiResponse.success(res, 'Categorias disponíveis', categorias);
});
