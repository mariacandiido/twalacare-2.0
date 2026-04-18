const { prisma } = require('../lib/prisma');

exports.getCategorias = async () => {
  return await prisma.categoriaMedicamento.findMany({
    where: { ativo: true }
  });
};

exports.createCategoria = async (data, filename) => {
  return await prisma.categoriaMedicamento.create({
    data: {
      nome: data.nome,
      descricao: data.descricao,
      image_url: filename ? `/uploads/categorias/${filename}` : null
    }
  });
};

exports.updateCategoria = async (id, data, filename) => {
  const updateData = { ...data };
  if (filename) updateData.image_url = `/uploads/categorias/${filename}`;
  // Remove fields that shouldn't be blindly updated if they exist
  delete updateData.id;
  
  return await prisma.categoriaMedicamento.update({
    where: { id: parseInt(id) },
    data: updateData
  });
};

exports.deleteCategoria = async (id) => {
  return await prisma.categoriaMedicamento.update({
    where: { id: parseInt(id) },
    data: { ativo: false }
  });
};
