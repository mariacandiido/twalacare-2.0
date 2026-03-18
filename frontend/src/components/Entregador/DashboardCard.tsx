import type { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  titulo: string;
  valor: string | number;
  descricao: string;
  icon: LucideIcon;
  corIcone?: string;
  fundoIcone?: string;
  rodape?: string;
  corRodape?: string;
  borderColor?: string;
}

export function DashboardCard({
  titulo,
  valor,
  descricao,
  icon: Icon,
  corIcone = '#2c5530',
  fundoIcone,
  rodape,
  corRodape = '#2c5530',
  borderColor = '#2c5530',
}: DashboardCardProps) {
  const bg = fundoIcone ?? 'rgba(44,85,48,0.07)';

  return (
    <div
      className="rounded-xl p-6 flex flex-col gap-3 transition-all duration-300"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid rgba(44,85,48,0.08)',
        borderLeft: `4px solid ${borderColor}`,
        boxShadow: '0 4px 6px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(44,85,48,0.1)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 6px rgba(0,0,0,0.04)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      <div className="flex items-start justify-between">
        <div className="p-2.5 rounded-xl" style={{ backgroundColor: bg }}>
          <Icon className="w-5 h-5" style={{ color: corIcone, width: 20, height: 20 }} />
        </div>
      </div>

      <div>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 28, color: '#2c3e2c' }}>
          {valor}
        </p>
        <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: '#5a6b5a', marginTop: 4 }}>
          {descricao}
        </p>
      </div>

      <div
        className="flex items-center justify-between pt-2"
        style={{ borderTop: '1px solid rgba(44,85,48,0.06)' }}
      >
        <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: 13, color: '#2c3e2c' }}>
          {titulo}
        </p>
        {rodape && (
          <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, fontWeight: 500, color: corRodape }}>
            {rodape}
          </span>
        )}
      </div>
    </div>
  );
}
