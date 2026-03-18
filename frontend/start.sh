#!/bin/bash
# Script para iniciar o desenvolvimento rápidamente

echo "🚀 TwalaCare - Setup de Desenvolvimento"
echo "========================================"
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não instalado. Instale em https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js: $(node --version)"
echo "✅ npm: $(npm --version)"
echo ""

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

echo "✅ Dependências instaladas"
echo ""

# Informações de credenciais
echo "🔐 Credenciais de Teste Disponíveis:"
echo ""
echo "👤 Cliente:"
echo "   Email: joao@example.com"
echo "   Senha: qualquer_coisa"
echo ""
echo "🏥 Farmácia:"
echo "   Email: central@pharmacy.com"
echo "   Senha: qualquer_coisa"
echo ""
echo "🚚 Entregador:"
echo "   Email: carlos@delivery.com"
echo "   Senha: qualquer_coisa"
echo ""
echo "👨‍💼 Administrador:"
echo "   Email: admin@twalcare.com"
echo "   Senha: qualquer_coisa"
echo ""

# Iniciar servidor
echo "🎯 Iniciando servidor de desenvolvimento..."
echo "📍 Acesse em: http://localhost:5173"
echo ""
npm run dev
