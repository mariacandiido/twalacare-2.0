import { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";

type FarmaciaRow = any;
type EntregadorRow = any;

export function AdminAprovacoes() {
  const [farmacias, setFarmacias] = useState<FarmaciaRow[]>([]);
  const [entregadores, setEntregadores] = useState<EntregadorRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const [fRes, eRes] = await Promise.all([
      adminService.getFarmacias({ limit: 80 }),
      adminService.getEntregadores({ limit: 80 }),
    ]);

    if (!fRes.success || !eRes.success) {
      setError(fRes.error || eRes.error || "Erro ao buscar aprovações");
      return;
    }

    setFarmacias(fRes.data);
    setEntregadores(eRes.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (fn: () => Promise<any>) => {
    const res = await fn();
    if (!res.success) {
      setError(res.error || "Erro na operação");
      return;
    }
    await load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[#2c5530]">Aprovações</h1>
      {error && <p className="text-red-600">{error}</p>}

      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Farmácias</h2>
        <div className="mt-3 space-y-2">
          {farmacias.length === 0 && (
            <span className="text-gray-500">Nenhuma farmácia</span>
          )}
          {farmacias.map((farm) => (
            <div
              key={farm.id}
              className="rounded-lg border p-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{farm.nome}</div>
                  <small className="text-xs text-gray-500 block">
                    Status: {farm.User?.status ?? farm.status}
                  </small>
                  {farm.documentos && farm.documentos.length > 0 ? (
                    <div className="mt-2 space-y-1 text-sm text-gray-700">
                      <div className="font-medium text-gray-800">Documentos enviados:</div>
                      {farm.documentos.map((doc: any, index: number) => (
                        <a
                          key={index}
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-green-700 underline"
                        >
                          {doc.label}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-2 text-sm text-gray-500">Sem documentos enviados</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      submit(() => adminService.approveFarmacia(farm.id))
                    }
                    className="rounded bg-green-600 px-3 py-1 text-white"
                  >
                    Aprovar
                  </button>
                  <button
                    onClick={() =>
                      submit(() =>
                        adminService.rejectFarmacia(
                          farm.id,
                          "Rejeitado pelo admin",
                        ),
                      )
                    }
                    className="rounded bg-red-600 px-3 py-1 text-white"
                  >
                    Rejeitar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Entregadores</h2>
        <div className="mt-3 space-y-2">
          {entregadores.length === 0 && (
            <span className="text-gray-500">Nenhum entregador</span>
          )}
          {entregadores.map((ent) => (
            <div
              key={ent.id}
              className="rounded-lg border p-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{ent.nome}</div>
                  <small className="text-xs text-gray-500 block">
                    Status: {ent.status}
                  </small>
                  {ent.documentos && ent.documentos.length > 0 ? (
                    <div className="mt-2 space-y-1 text-sm text-gray-700">
                      <div className="font-medium text-gray-800">Documentos enviados:</div>
                      {ent.documentos.map((doc: any, index: number) => (
                        <a
                          key={index}
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-green-700 underline"
                        >
                          {doc.label}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-2 text-sm text-gray-500">Sem documentos enviados</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      submit(() => adminService.approveEntregador(ent.id))
                    }
                    className="rounded bg-green-600 px-3 py-1 text-white"
                  >
                    Aprovar
                  </button>
                  <button
                    onClick={() =>
                      submit(() => adminService.rejectEntregador(ent.id))
                    }
                    className="rounded bg-red-600 px-3 py-1 text-white"
                  >
                    Rejeitar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
