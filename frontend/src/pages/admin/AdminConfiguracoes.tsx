export function AdminConfiguracoes() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#2c5530] mb-4">Configurações</h1>
      <p className="text-sm text-gray-500">
        Configurações do painel de administração e preferências do usuário.
      </p>
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm mt-4">
        <div className="mb-3">
          <label className="block text-sm text-gray-600">
            Idioma do painel
          </label>
          <select className="mt-1 block w-full rounded-lg border-gray-200 p-2">
            <option value="pt">Português (PT-AO)</option>
            <option value="en">English</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600">Modo de cor</label>
          <select className="mt-1 block w-full rounded-lg border-gray-200 p-2">
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
          </select>
        </div>
      </div>
    </div>
  );
}
