const categoriaService = require('../services/categoriaService');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/apiResponse');

exports.getCategorias = catchAsync(async (req, res) => {
  const result = await categoriaService.getCategorias();
  ApiResponse.success(res, 'Categorias de medicamentos', result);
});

exports.createCategoria = catchAsync(async (req, res) => {
  const filename = req.file ? req.file.filename : null;
  const result = await categoriaService.createCategoria(req.body, filename);
  ApiResponse.success(res, 'Categoria criada com sucesso', result, 201);
});

exports.updateCategoria = catchAsync(async (req, res) => {
  const filename = req.file ? req.file.filename : null;
  const result = await categoriaService.updateCategoria(req.params.id, req.body, filename);
  ApiResponse.success(res, 'Categoria modificada', result);
});

exports.deleteCategoria = catchAsync(async (req, res) => {
  const result = await categoriaService.deleteCategoria(req.params.id);
  ApiResponse.success(res, 'Categoria desativada logica mente', result);
});
