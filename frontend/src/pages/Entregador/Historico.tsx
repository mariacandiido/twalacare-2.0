import { useState } from 'react';
import { CheckCircle2, Star, MapPin, Clock, TrendingUp, Search } from 'lucide-react';
import { EntregadorLayout } from '../../layouts/EntregadorLayout';
import { useEntregadorStore } from '../../store/entregadorStore';

export function Historico() {
  const { disponivel, toggleDisponivel, historico, perfil } = useEntregadorStore();
  const [busca, setBusca] = useState('');

  const filtradas = historico.filter(
    (e) =>
      e.cliente.toLowerCase().includes(busca.toLowerCase()) ||
      e.farmacia.toLowerCase().includes(busca.toLowerCase()) ||
      e.clienteEndereco.toLowerCase().includes(busca.toLowerCase())
  );

  const totalGanhos = historico.reduce((soma, e) => soma + e.valor, 0);
  const mediaAvaliacao =
    historico.length > 0
      ? (historico.reduce((soma, e) => soma + (e.avaliacao ?? 0), 0) / historico.length).toFixed(1)
      : '';

  return (
    <EntregadorLayout disponivel={disponivel} onToggleDisponivel={toggleDisponivel}>
      <div className="twala-page-enter p-6 lg:p-8 space-y-6" style={{ backgroundColor: '#faf7f2', minHeight: '100vh' }}>
        {/* Cabe?alho */}
        <div>
          <h1
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
              color: '#2c3e2c',
              marginBottom: 4,
            }}
          >
            Hist?rico de Entregas
          </h1>
          <div
            style={{
              width: 50,
              height: 3,
              background: 'linear-gradient(90deg, #2c5530, #c7a252)',
              borderRadius: 2,
              marginBottom: 4,
            }}
          />
          <p style={{ fontFamily: "'Roboto', sans-serif", color: '#4a7856', fontSize: 13 }}>
            {historico.length} entrega(s) conclu?da(s) no total
          </p>
        </div>

        {/* Estat�sticas resumo */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: 'Total de Entregas',
              valor: perfil.totalEntregas,
              bg: 'rgba(44,85,48,0.07)',
              color: '#2c5530',
              icon: <CheckCircle2 style={{ width: 18, height: 18 }} />,
            },
            {
              label: 'Total Ganho',
              valor: `${totalGanhos.toLocaleString()} Kz`,
              bg: 'rgba(74,120,86,0.08)',
              color: '#4a7856',
              icon: <TrendingUp style={{ width: 18, height: 18 }} />,
            },
            {
              label: 'Avalia��o M�dia',
              valor: mediaAvaliacao,
              bg: 'rgba(199,162,82,0.12)',
              color: '#a07a2a',
              icon: <Star style={{ width: 18, height: 18 }} />,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                backgroundColor: stat.bg,
                borderRadius: 10,
                padding: '12px 16px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: stat.color,
                  marginBottom: 4,
                }}
              >
                {stat.icon}
              </div>
              <p
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  color: stat.color,
                  margin: 0,
                }}
              >
                {stat.valor}
              </p>
              <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 11, color: '#888', marginTop: 2 }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Barra de pesquisa */}
        <div className="relative">
          <Search
            style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 16,
              height: 16,
              color: '#4a7856',
            }}
          />
          <input
            type="text"
            placeholder="Pesquisar por cliente, farm?cia ou endere?o..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="twala-input w-full"
            style={{ paddingLeft: 44 }}
          />
        </div>

        {/* Lista de entregas conclu?das */}
        {filtradas.length === 0 ? (
          <div className="twala-card flex flex-col items-center justify-center py-16 text-center">
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 16,
                backgroundColor: 'rgba(44,85,48,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <CheckCircle2 style={{ width: 36, height: 36, color: '#4a7856' }} />
            </div>
            {busca ? (
              <>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, color: '#4a7856' }}>
                  Nenhum resultado para "{busca}"
                </p>
                <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: '#888', marginTop: 4 }}>
                  Tente pesquisar com outros termos.
                </p>
              </>
            ) : (
              <>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, color: '#4a7856' }}>
                  Nenhuma entrega conclu?da ainda
                </p>
                <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: '#888', marginTop: 4 }}>
                  O seu hist?rico de entregas aparecer? aqui.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtradas.map((entrega) => (
              <div
                key={entrega.id}
                className="twala-card"
                style={{ padding: '16px 20px' }}
              >
                {/* Cabe?alho do card */}
                <div className="flex items-start justify-between gap-4" style={{ marginBottom: 12 }}>
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(44,85,48,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <CheckCircle2 style={{ width: 18, height: 18, color: '#2c5530' }} />
                    </div>
                    <div>
                      <p
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                          fontSize: 14,
                          color: '#2c3e2c',
                          margin: 0,
                        }}
                      >
                        {entrega.cliente}
                      </p>
                      <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: '#888', margin: '2px 0 0' }}>
                        {entrega.data}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 700,
                        fontSize: 15,
                        color: '#2c5530',
                        margin: 0,
                      }}
                    >
                      {entrega.valor.toLocaleString()} Kz
                    </p>
                    {entrega.avaliacao !== undefined && (
                      <div className="flex items-center gap-1 justify-end" style={{ marginTop: 2 }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            style={{
                              width: 12,
                              height: 12,
                              color: i < entrega.avaliacao! ? '#c7a252' : '#ddd',
                              fill: i < entrega.avaliacao! ? '#c7a252' : 'none',
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Detalhes */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin style={{ width: 14, height: 14, color: '#4a7856', flexShrink: 0 }} />
                    <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: '#555', margin: 0 }}>
                      <span style={{ fontWeight: 500 }}>Farm?cia:</span> {entrega.farmacia}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin style={{ width: 14, height: 14, color: '#c7a252', flexShrink: 0 }} />
                    <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: '#555', margin: 0 }}>
                      <span style={{ fontWeight: 500 }}>Destino:</span> {entrega.clienteEndereco}
                    </p>
                  </div>
                  {entrega.duracao && (
                    <div className="flex items-center gap-2">
                      <Clock style={{ width: 14, height: 14, color: '#888', flexShrink: 0 }} />
                      <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: '#555', margin: 0 }}>
                        <span style={{ fontWeight: 500 }}>Dura??o:</span> {entrega.duracao}
                      </p>
                    </div>
                  )}
                </div>

                {/* Badge de status */}
                <div style={{ marginTop: 10 }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      backgroundColor: 'rgba(44,85,48,0.1)',
                      color: '#2c5530',
                      borderRadius: 20,
                      padding: '3px 10px',
                      fontSize: 11,
                      fontFamily: "'Roboto', sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    <CheckCircle2 style={{ width: 11, height: 11 }} />
                    Entregue
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </EntregadorLayout>
  );
}
