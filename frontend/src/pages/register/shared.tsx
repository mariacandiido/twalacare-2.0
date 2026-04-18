import { useRef, useState, type DragEvent, type ChangeEvent } from "react";
import {
  Eye, EyeOff, AlertCircle, CheckCircle2, Check, X,
  Upload, FileText, ImageIcon, ChevronDown,
} from "lucide-react";
import { PROVINCIAS, getMunicipios } from "../../data/angola";

// ─── Design tokens ────────────────────────────────────────────────────────────
export const GREEN = "#2c5530";
export const GOLD  = "#c7a252";
export const RED   = "#d45a5a";
export const BG    = "#faf7f2";

// ─── Painel hero esquerdo (reutilizado em todas as telas de registo) ───────────
export function HeroPanel({ titulo, subtitulo }: { titulo: string; subtitulo: string }) {
  return (
    <div
      className="hidden md:flex w-5/12 relative overflow-hidden flex-col items-center justify-center p-12 flex-shrink-0"
      style={{ background: `linear-gradient(145deg, ${GREEN} 0%, #3a6b40 60%, #2c5530 100%)` }}
    >
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10"
        style={{ background: GOLD, transform: "translate(40%,-40%)" }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
        style={{ background: GOLD, transform: "translate(-40%,40%)" }} />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full opacity-5"
        style={{ background: GOLD, transform: "translate(-50%,-50%)" }} />

      <div className="relative z-10 text-center max-w-xs">
        <div className="flex justify-center mb-8">
          <div style={{
            width: 88, height: 88,
            background: `linear-gradient(135deg, ${GOLD}, #a88235)`,
            borderRadius: 22,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 16px 40px rgba(0,0,0,0.3)",
            border: "2px solid rgba(255,255,255,0.2)",
          }}>
            <span style={{ color: GREEN, fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 38 }}>T</span>
          </div>
        </div>
        <h1 className="mb-3" style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 26, color: "#fff", lineHeight: 1.2 }}>
          {titulo}
        </h1>
        <p style={{ fontFamily: "'Roboto',sans-serif", color: "rgba(255,255,255,0.8)", fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
          {subtitulo}
        </p>
        <div className="flex justify-center gap-8 mb-6">
          {[{ num: "50+", lbl: "Farmácias" }, { num: "4.9★", lbl: "Avaliação" }, { num: "30m", lbl: "Entrega" }].map(s => (
            <div key={s.lbl} className="text-center">
              <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 18, color: GOLD }}>{s.num}</p>
              <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{s.lbl}</p>
            </div>
          ))}
        </div>
        <div style={{ height: 2, width: 70, margin: "0 auto", background: `linear-gradient(90deg,transparent,${GOLD},transparent)`, borderRadius: 2 }} />
        <div className="mt-5 flex justify-center">
          <span className="twala-seal" style={{ fontSize: 11 }}>Farmácia de Confiança · Angola</span>
        </div>
      </div>
    </div>
  );
}

// ─── Logo mobile (aparece no topo quando o hero está escondido) ───────────────
export function MobileLogo() {
  return (
    <div className="md:hidden flex justify-center mb-5">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${GREEN}, #4a7856)` }}>
        <span style={{ color: GOLD, fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 22 }}>T</span>
      </div>
    </div>
  );
}

// ─── Barra de progresso ───────────────────────────────────────────────────────
export function ProgressBar({ step, total, labels }: { step: number; total: number; labels: string[] }) {
  return (
    <div className="mb-7">
      <div className="flex items-center justify-between mb-2">
        {labels.map((label, i) => {
          const n = i + 1;
          const done   = n < step;
          const active = n === step;
          return (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                style={{
                  backgroundColor: done ? GREEN : active ? GREEN : "rgba(44,85,48,0.12)",
                  border: active ? `2px solid ${GREEN}` : done ? "none" : "2px solid rgba(44,85,48,0.2)",
                }}>
                {done
                  ? <Check style={{ width: 13, height: 13, color: "#fff" }} />
                  : <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 12, color: active ? "#fff" : "#9aab9a" }}>{n}</span>
                }
              </div>
              <span style={{ fontFamily: "'Roboto',sans-serif", fontSize: 12, fontWeight: active ? 600 : 400, color: active ? GREEN : done ? "#4a7856" : "#9aab9a" }}>
                {label}
              </span>
              {i < total - 1 && (
                <div className="flex-1 mx-2 h-0.5 rounded" style={{ minWidth: 20, backgroundColor: done ? GREEN : "rgba(44,85,48,0.15)" }} />
              )}
            </div>
          );
        })}
      </div>
      {/* Barra percentual */}
      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(44,85,48,0.1)" }}>
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${((step - 1) / (total - 1)) * 100}%`, background: `linear-gradient(90deg, ${GREEN}, #4a7856)` }} />
      </div>
      <p className="mt-1.5 text-right" style={{ fontFamily: "'Roboto',sans-serif", fontSize: 11, color: "#9aab9a" }}>
        Etapa {step} de {total}
      </p>
    </div>
  );
}

// ─── Toast de sucesso / erro ──────────────────────────────────────────────────
export function Toast({ type, message, onClose }: { type: "success" | "error"; message: string; onClose: () => void }) {
  const isSuccess = type === "success";
  return (
    <div
      className="fixed top-5 right-5 z-50 flex items-start gap-3 px-4 py-3 rounded-xl shadow-xl max-w-sm twala-page-enter"
      style={{
        backgroundColor: isSuccess ? "rgba(44,85,48,0.97)" : "rgba(212,90,90,0.97)",
        border: `1px solid ${isSuccess ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.2)"}`,
        backdropFilter: "blur(8px)",
      }}
    >
      {isSuccess
        ? <CheckCircle2 style={{ width: 18, height: 18, color: "#fff", flexShrink: 0, marginTop: 1 }} />
        : <AlertCircle  style={{ width: 18, height: 18, color: "#fff", flexShrink: 0, marginTop: 1 }} />}
      <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 14, color: "#fff", flex: 1 }}>{message}</p>
      <button onClick={onClose} style={{ color: "rgba(255,255,255,0.7)" }} className="hover:text-white transition-colors">
        <X style={{ width: 16, height: 16 }} />
      </button>
    </div>
  );
}

// ─── Banner de confirmação (após envio final) ─────────────────────────────────
export function SuccessBanner({ title, body, onAction, actionLabel }: {
  title: string; body: string; onAction: () => void; actionLabel: string;
}) {
  return (
    <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: "rgba(44,85,48,0.06)", border: `1px solid rgba(44,85,48,0.2)` }}>
      <div className="flex justify-center mb-5">
        <div className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(44,85,48,0.12)" }}>
          <CheckCircle2 style={{ width: 40, height: 40, color: GREEN }} />
        </div>
      </div>
      <h3 className="mb-3" style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 20, color: "#2c3e2c" }}>{title}</h3>
      <p className="mb-7" style={{ fontFamily: "'Roboto',sans-serif", fontSize: 14, color: "#5a6b5a", lineHeight: 1.7 }}>{body}</p>
      <button onClick={onAction} className="twala-btn-primary" style={{ padding: "12px 32px", fontSize: 15 }}>
        {actionLabel}
      </button>
    </div>
  );
}

// ─── Título de seção ──────────────────────────────────────────────────────────
export function SectionTitle({ icon: Icon, label }: { icon: typeof Check; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4 pt-2">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "rgba(44,85,48,0.1)" }}>
        <Icon style={{ width: 14, height: 14, color: GREEN }} />
      </div>
      <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 13, color: GREEN, textTransform: "uppercase", letterSpacing: "0.7px" }}>
        {label}
      </p>
      <div className="flex-1 h-px" style={{ backgroundColor: "rgba(44,85,48,0.12)" }} />
    </div>
  );
}

// ─── Campo de input genérico ──────────────────────────────────────────────────
interface FieldInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  maxLength?: number;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"];
  disabled?: boolean;
  rightSlot?: React.ReactNode;
  autoComplete?: string;
}

export function FieldInput({
  label, value, onChange, type = "text", placeholder, error, hint,
  required, maxLength, inputMode, disabled, rightSlot, autoComplete,
}: FieldInputProps) {
  return (
    <div>
      <label className="block mb-1.5"
        style={{ fontFamily: "'Roboto',sans-serif", fontSize: 13, fontWeight: 500, color: "#2c3e2c" }}>
        {label}{required && <span style={{ color: RED, marginLeft: 2 }}>*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          inputMode={inputMode}
          disabled={disabled}
          autoComplete={autoComplete}
          className="twala-input w-full"
          style={{
            borderColor: error ? RED : undefined,
            backgroundColor: disabled ? "rgba(44,85,48,0.03)" : undefined,
            paddingRight: rightSlot ? 40 : undefined,
          }}
        />
        {rightSlot && (
          <div className="absolute inset-y-0 right-3 flex items-center">{rightSlot}</div>
        )}
      </div>
      {hint && !error && (
        <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 11, color: "#9aab9a", marginTop: 4 }}>{hint}</p>
      )}
      {error && (
        <p className="flex items-center gap-1 mt-1" style={{ fontFamily: "'Roboto',sans-serif", fontSize: 12, color: RED }}>
          <AlertCircle style={{ width: 11, height: 11 }} />{error}
        </p>
      )}
    </div>
  );
}

// ─── Campo de senha com toggle visibilidade ───────────────────────────────────
export function PasswordInput({
  label, value, onChange, placeholder, error, required, autoComplete,
}: Omit<FieldInputProps, "type" | "rightSlot">) {
  const [show, setShow] = useState(false);
  return (
    <FieldInput
      label={label}
      value={value}
      onChange={onChange}
      type={show ? "text" : "password"}
      placeholder={placeholder}
      error={error}
      required={required}
      autoComplete={autoComplete}
      rightSlot={
        <button type="button" onClick={() => setShow(!show)} style={{ color: "#9aab9a" }} className="hover:text-gray-600 transition-colors">
          {show ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
        </button>
      }
    />
  );
}

// ─── Regras da senha (validação em tempo real) ────────────────────────────────
export interface PasswordRule {
  label: string;
  test: (v: string) => boolean;
}

export const DEFAULT_PASSWORD_RULES: PasswordRule[] = [
  { label: "Mínimo 8 caracteres",  test: (v) => v.trim().length >= 8 },
  { label: "Pelo menos 1 letra",   test: (v) => /[a-zA-Z]/.test(v.trim()) },
  { label: "Pelo menos 1 número",  test: (v) => /\d/.test(v.trim()) },
];

export function PasswordRules({ password, rules = DEFAULT_PASSWORD_RULES }: { password: string; rules?: PasswordRule[] }) {
  if (!password) return null;
  return (
    <div className="space-y-1 mt-2 px-1">
      {rules.map((r) => {
        const ok = r.test(password);
        return (
          <div key={r.label} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200"
              style={{ backgroundColor: ok ? "rgba(44,85,48,0.15)" : "rgba(212,90,90,0.1)" }}>
              {ok
                ? <Check   style={{ width: 9, height: 9, color: GREEN }} />
                : <X       style={{ width: 9, height: 9, color: RED }}   />}
            </div>
            <span style={{ fontFamily: "'Roboto',sans-serif", fontSize: 12, color: ok ? GREEN : "#9aab9a" }}>
              {r.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function passwordValid(password: string, rules = DEFAULT_PASSWORD_RULES): boolean {
  return rules.every((r) => r.test(password));
}

// ─── Select de província ──────────────────────────────────────────────────────
export function SelectProvincia({
  value, onChange, error, required,
}: { value: string; onChange: (v: string) => void; error?: string; required?: boolean }) {
  return (
    <div>
      <label className="block mb-1.5"
        style={{ fontFamily: "'Roboto',sans-serif", fontSize: 13, fontWeight: 500, color: "#2c3e2c" }}>
        Província{required && <span style={{ color: RED, marginLeft: 2 }}>*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="twala-input w-full appearance-none"
          style={{ borderColor: error ? RED : undefined, paddingRight: 36 }}
        >
          <option value="">Selecionar província</option>
          {PROVINCIAS.map((p) => <option key={p.nome} value={p.nome}>{p.nome}</option>)}
        </select>
        <ChevronDown style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#9aab9a", pointerEvents: "none" }} />
      </div>
      {error && (
        <p className="flex items-center gap-1 mt-1" style={{ fontFamily: "'Roboto',sans-serif", fontSize: 12, color: RED }}>
          <AlertCircle style={{ width: 11, height: 11 }} />{error}
        </p>
      )}
    </div>
  );
}

// ─── Select de município ──────────────────────────────────────────────────────
export function SelectMunicipio({
  provincia, value, onChange, error, required,
}: { provincia: string; value: string; onChange: (v: string) => void; error?: string; required?: boolean }) {
  const municipios = getMunicipios(provincia);
  return (
    <div>
      <label className="block mb-1.5"
        style={{ fontFamily: "'Roboto',sans-serif", fontSize: 13, fontWeight: 500, color: "#2c3e2c" }}>
        Município{required && <span style={{ color: RED, marginLeft: 2 }}>*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={!provincia}
          className="twala-input w-full appearance-none"
          style={{
            borderColor: error ? RED : undefined,
            paddingRight: 36,
            backgroundColor: !provincia ? "rgba(44,85,48,0.03)" : undefined,
          }}
        >
          <option value="">{provincia ? "Selecionar município" : "Primeiro escolha a província"}</option>
          {municipios.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <ChevronDown style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#9aab9a", pointerEvents: "none" }} />
      </div>
      {error && (
        <p className="flex items-center gap-1 mt-1" style={{ fontFamily: "'Roboto',sans-serif", fontSize: 12, color: RED }}>
          <AlertCircle style={{ width: 11, height: 11 }} />{error}
        </p>
      )}
    </div>
  );
}

// ─── Componente de Upload de Documentos ──────────────────────────────────────
export interface UploadedFile {
  file: File;
  preview: string | null; // URL de preview para imagens
  status: "idle" | "uploading" | "done" | "error";
}

interface UploadFieldProps {
  label: string;
  required?: boolean;
  accept?: string;
  value: UploadedFile | null;
  onChange: (f: UploadedFile | null) => void;
  error?: string;
  hint?: string;
}

export function UploadField({ label, required, accept = ".pdf,.jpg,.jpeg,.png", value, onChange, error, hint }: UploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const MAX_MB = 5;

  const processFile = (file: File) => {
    if (file.size > MAX_MB * 1024 * 1024) {
      onChange({ file, preview: null, status: "error" });
      return;
    }
    const isImage = file.type.startsWith("image/");
    if (isImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange({ file, preview: e.target?.result as string, status: "done" });
      };
      reader.readAsDataURL(file);
    } else {
      onChange({ file, preview: null, status: "done" });
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const isError = value?.status === "error";
  const isDone  = value?.status === "done";

  return (
    <div>
      <label className="block mb-1.5"
        style={{ fontFamily: "'Roboto',sans-serif", fontSize: 13, fontWeight: 500, color: "#2c3e2c" }}>
        {label}{required && <span style={{ color: RED, marginLeft: 2 }}>*</span>}
      </label>

      {/* Área de drop */}
      {!isDone ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          className="relative flex flex-col items-center justify-center gap-2 rounded-xl cursor-pointer transition-all duration-200"
          style={{
            padding: "20px 16px",
            border: `2px dashed ${isError ? RED : dragging ? GREEN : error ? RED : "rgba(44,85,48,0.25)"}`,
            backgroundColor: dragging ? "rgba(44,85,48,0.05)" : isError ? "rgba(212,90,90,0.04)" : "rgba(44,85,48,0.02)",
          }}
        >
          <Upload style={{ width: 22, height: 22, color: isError ? RED : "#9aab9a" }} />
          <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 13, color: "#5a6b5a", textAlign: "center" }}>
            <span style={{ color: GREEN, fontWeight: 500 }}>Clique para carregar</span> ou arraste aqui
          </p>
          <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 11, color: "#9aab9a" }}>
            {hint ?? "PDF, JPG, PNG · Máx. 5 MB"}
          </p>
          <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />
        </div>
      ) : (
        /* Preview / ficheiro carregado */
        <div className="flex items-center gap-3 p-3 rounded-xl"
          style={{ border: `1.5px solid rgba(44,85,48,0.25)`, backgroundColor: "rgba(44,85,48,0.04)" }}>
          {value?.preview
            ? <img src={value.preview} alt="preview" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
            : (
              <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(44,85,48,0.1)" }}>
                <FileText style={{ width: 22, height: 22, color: GREEN }} />
              </div>
            )
          }
          <div className="flex-1 min-w-0">
            <p className="truncate" style={{ fontFamily: "'Roboto',sans-serif", fontSize: 13, fontWeight: 500, color: "#2c3e2c" }}>
              {value?.file.name}
            </p>
            <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 11, color: "#9aab9a" }}>
              {((value?.file.size ?? 0) / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(44,85,48,0.15)" }}>
              <Check style={{ width: 10, height: 10, color: GREEN }} />
            </div>
            <button type="button" onClick={() => onChange(null)} style={{ color: "#9aab9a" }} className="hover:text-red-400 transition-colors">
              <X style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>
      )}

      {isError && (
        <p className="flex items-center gap-1 mt-1" style={{ fontFamily: "'Roboto',sans-serif", fontSize: 12, color: RED }}>
          <AlertCircle style={{ width: 11, height: 11 }} />Ficheiro excede 5 MB
        </p>
      )}
      {error && !isError && (
        <p className="flex items-center gap-1 mt-1" style={{ fontFamily: "'Roboto',sans-serif", fontSize: 12, color: RED }}>
          <AlertCircle style={{ width: 11, height: 11 }} />{error}
        </p>
      )}
    </div>
  );
}

// ─── Grade de uploads (2 colunas) ─────────────────────────────────────────────
export function UploadGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

// ─── Checkbox de termos ───────────────────────────────────────────────────────
export function TermsCheckbox({ checked, onChange, error }: {
  checked: boolean; onChange: (v: boolean) => void; error?: string;
}) {
  return (
    <div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="twala-checkbox mt-0.5 flex-shrink-0"
        />
        <span style={{ fontFamily: "'Roboto',sans-serif", fontSize: 13, color: "#5a6b5a", lineHeight: 1.6 }}>
          Aceito os{" "}
          <a href="#" style={{ color: GREEN, fontWeight: 500 }} className="hover:opacity-75">Termos e Condições</a>
          {" "}e a{" "}
          <a href="#" style={{ color: GREEN, fontWeight: 500 }} className="hover:opacity-75">Política de Privacidade</a>
          {" "}da plataforma TwalaCare.
        </span>
      </label>
      {error && (
        <p className="flex items-center gap-1 mt-1.5 ml-6" style={{ fontFamily: "'Roboto',sans-serif", fontSize: 12, color: RED }}>
          <AlertCircle style={{ width: 11, height: 11 }} />{error}
        </p>
      )}
    </div>
  );
}

// ─── Botão primário com loading ───────────────────────────────────────────────
export function SubmitButton({ loading, label, loadingLabel }: { loading: boolean; label: string; loadingLabel?: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="twala-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      style={{ padding: "13px 24px", fontSize: 15 }}
    >
      {loading ? (
        <>
          <svg className="animate-spin" style={{ width: 18, height: 18 }} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          {loadingLabel ?? "A processar..."}
        </>
      ) : label}
    </button>
  );
}

// ─── Cabeçalho da página de 2ª etapa ─────────────────────────────────────────
export function StepPageHeader({
  onBack, stepLabel,
}: { onBack: () => void; stepLabel: string }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-5 py-3"
      style={{ backgroundColor: "#fff", borderBottom: "1px solid rgba(44,85,48,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <button type="button" onClick={onBack}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
        style={{ color: GREEN, fontFamily: "'Roboto',sans-serif", fontSize: 13, fontWeight: 500, border: `1px solid rgba(44,85,48,0.2)` }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(44,85,48,0.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        ← Voltar
      </button>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${GOLD}, #a88235)` }}>
          <span style={{ color: GREEN, fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14 }}>T</span>
        </div>
        <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 16, color: GREEN }}>
          Twala<span style={{ color: GOLD }}>Care</span>
        </span>
      </div>
      <span style={{ fontFamily: "'Roboto',sans-serif", fontSize: 12, color: "#9aab9a" }}>{stepLabel}</span>
    </header>
  );
}

// ─── Accordion de campos opcionais ───────────────────────────────────────────
export function OptionalAccordion({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(44,85,48,0.15)" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 transition-colors"
        style={{ backgroundColor: open ? "rgba(44,85,48,0.04)" : "transparent" }}
      >
        <span style={{ fontFamily: "'Roboto',sans-serif", fontSize: 14, fontWeight: 500, color: GREEN }}>{label}</span>
        <ChevronDown style={{ width: 16, height: 16, color: GREEN, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      {open && <div className="px-4 pb-4 pt-2 space-y-4">{children}</div>}
    </div>
  );
}

// ─── Badge de status ──────────────────────────────────────────────────────────
export function StatusBadge({ status }: { status: "pendente" | "aprovado" | "rejeitado" }) {
  const map = {
    pendente:  { label: "Aguardando análise", bg: "rgba(199,162,82,0.15)", color: "#a07a2a" },
    aprovado:  { label: "Aprovado",           bg: "rgba(44,85,48,0.12)",  color: GREEN },
    rejeitado: { label: "Rejeitado",          bg: "rgba(212,90,90,0.12)", color: RED },
  };
  const s = map[status];
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
      style={{ backgroundColor: s.bg, fontFamily: "'Roboto',sans-serif", fontSize: 12, fontWeight: 600, color: s.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
      {s.label}
    </span>
  );
}

// ─── Formatar telefone angolano ───────────────────────────────────────────────
export function formatPhone(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 9);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
}

export function validateEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// ─── Linha divisória dourada ──────────────────────────────────────────────────
export function GoldDivider() {
  return <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: "4px 0" }} />;
}

// ─── Ícone de imagem placeholder ─────────────────────────────────────────────
export { ImageIcon };
