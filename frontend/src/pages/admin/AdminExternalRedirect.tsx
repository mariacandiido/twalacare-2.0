import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getAdminAppUrl } from "../../adminAppUrl";

export function AdminExternalRedirect() {
  const location = useLocation();

  useEffect(() => {
    const targetUrl = getAdminAppUrl(
      `${location.pathname}${location.search}${location.hash}`,
    );

    window.location.replace(targetUrl);
  }, [location.hash, location.pathname, location.search]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-6">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <h1
          style={{
            color: "#1f4d2b",
            fontFamily: "'Poppins', sans-serif",
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          A redirecionar para o admin privado...
        </h1>
        <p
          className="mt-3"
          style={{ color: "#5d6a60", fontFamily: "'Roboto', sans-serif", fontSize: 14, lineHeight: 1.7 }}
        >
          Se o redirecionamento não acontecer automaticamente, abra a área administrativa no link abaixo.
        </p>
        <a
          href={getAdminAppUrl(`${location.pathname}${location.search}${location.hash}`)}
          style={{ color: "#1f4d2b", fontFamily: "'Roboto', sans-serif", fontWeight: 700 }}
          className="mt-5 inline-block transition-opacity hover:opacity-75"
        >
          Abrir admin privado
        </a>
      </div>
    </div>
  );
}
