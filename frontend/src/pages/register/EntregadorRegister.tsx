import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Bike, FileText, CreditCard, Upload as UploadIcon } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { BANCOS_ANGOLA } from "../../data/angola";
import { useEntregadoresAdminStore } from "../../store/entregadoresAdminStore";
import {
  GoldDivider, ProgressBar, FieldInput, PasswordInput,
  PasswordRules, TermsCheckbox, SubmitButton, SelectProvincia, SelectMunicipio,
  UploadField, UploadGrid, Toast, SuccessBanner, SectionTitle, StepPageHeader,
  GREEN, GOLD, RED,
  formatPhone, validateEmail, passwordValid,
  type UploadedFile,
} from "./shared";
import { ChevronDown } from "lucide-react";

// ─── Etapa 1 ──────────────────────────────────────────────────────────────────
interface Step1Data {
  nome:            string;
  email:           string;
  telefone:        string;
  whatsapp:        string;
  password:        string;
  confirmPassword: string;
}

function Step1({ onBack, onNext }: { onBack: () => void; onNext: (d: Step1Data) => void }) {
  const { register } = useAuth();

  const [nome,            setNome]            = useState("");
  const [email,           setEmail]           = useState("");
  const [telefone,        setTelefone]        = useState("");
  const [whatsapp,        setWhatsapp]        = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termos,          setTermos]          = useState(false);
  const [errors,          setErrors]          = useState<Record<string, string>>({});
  const [isLoading,       setIsLoading]       = useState(false);
  const [toast,           setToast]           = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const clearErr = (k: string) => setErrors((p) => { const n = { ...p }; delete n[k]; return n; });

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!nome.trim())                 e.nome            = "Nome é obrigatório";
    if (!email.trim())                e.email           = "Email é obrigatório";
    else if (!validateEmail(email))   e.email           = "Email inválido";
    if (!telefone.trim())             e.telefone        = "Telefone é obrigatório";
    else if (telefone.replace(/\D/g,"").length < 9) e.telefone = "Número inválido";
    if (!passwordValid(password))     e.password        = "A senha não cumpre os requisitos";
    if (password !== confirmPassword) e.confirmPassword = "As senhas não coincidem";
    if (!termos)                      e.termos          = "É necessário aceitar os termos";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const result = await register({
        nome, email, telefone, password, confirmPassword, tipo: "entregador",
        veiculo: "moto",
      } as Parameters<typeof register>[0]);

      if (!result.success) {
        setToast({ type: "error", msg: result.message });
        return;
      }

      setToast({ type: "success", msg: "Conta criada com sucesso! Agora complete o cadastro enviando os seus documentos." });
      setTimeout(() => onNext({ nome, email, telefone, whatsapp, password, confirmPassword }), 1500);
    } catch {
      setToast({ type: "error", msg: "Ocorreu um erro. Tente novamente." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center p-6 twala-page-enter"
      style={{ backgroundColor: "#faf7f2" }}>
      {toast && <Toast type={toast.type} message={toast.msg} onClose={() => setToast(null)} />}

      <div className="w-full max-w-lg rounded-2xl p-8 my-6"
        style={{ backgroundColor: "#fff", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", border: "1px solid rgba(44,85,48,0.08)" }}>

          {/* Logo */}
          <div className="flex justify-center mb-5">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${GREEN}, #4a7856)` }}>
              <span style={{ color: GOLD, fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 22 }}>T</span>
            </div>
          </div>
          <ProgressBar step={1} total={2} labels={["Criar Conta", "Documentos"]} />

          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, color: "#2c3e2c", fontSize: 20 }}>
                Criação da Conta
              </h2>
              <p style={{ fontFamily: "'Roboto',sans-serif", color: "#5a6b5a", fontSize: 13, marginTop: 3 }}>
                Preencha os seus dados pessoais para começar
              </p>
            </div>
            <button type="button" onClick={onBack}
              className="px-3 py-1.5 rounded-lg flex-shrink-0 transition-colors"
              style={{ color: GREEN, border: "1px solid rgba(44,85,48,0.2)", fontFamily: "'Roboto',sans-serif", fontSize: 12 }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(44,85,48,0.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              ← Voltar
            </button>
          </div>

          <GoldDivider />

          <form onSubmit={handleSubmit} className="space-y-4 mt-5">
            <FieldInput
              label="Nome completo" required
              value={nome} onChange={(v) => { setNome(v); clearErr("nome"); }}
              placeholder="O seu nome completo"
              error={errors.nome}
              autoComplete="name"
            />
            <FieldInput
              label="Email" required type="email"
              value={email} onChange={(v) => { setEmail(v); clearErr("email"); }}
              placeholder="seu@email.com"
              error={errors.email}
              autoComplete="email"
            />
            <div className="grid grid-cols-2 gap-3">
              <FieldInput
                label="Telefone" required
                value={telefone} onChange={(v) => { setTelefone(formatPhone(v)); clearErr("telefone"); }}
                placeholder="9XX XXX XXX"
                error={errors.telefone}
                hint="+244 9XX XXX XXX"
                inputMode="numeric"
              />
              <div>
                <FieldInput
                  label="WhatsApp (recomendado)"
                  value={whatsapp} onChange={(v) => setWhatsapp(formatPhone(v))}
                  placeholder="9XX XXX XXX"
                  inputMode="numeric"
                />
                <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 11, color: "#c7a252", marginTop: 3 }}>
                  ★ Recomendado para receber pedidos
                </p>
              </div>
            </div>
            <PasswordInput
              label="Senha" required
              value={password} onChange={(v) => { setPassword(v); clearErr("password"); }}
              placeholder="Mínimo 8 caracteres"
              error={errors.password}
              autoComplete="new-password"
            />
            <PasswordRules password={password} />
            <PasswordInput
              label="Confirmar senha" required
              value={confirmPassword} onChange={(v) => { setConfirmPassword(v); clearErr("confirmPassword"); }}
              placeholder="Repita a senha"
              error={errors.confirmPassword}
              autoComplete="new-password"
            />
            {confirmPassword && (
              <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 12, color: password === confirmPassword ? GREEN : RED }}>
                {password === confirmPassword ? "✓ Senhas coincidem" : "✗ Senhas não coincidem"}
              </p>
            )}
            <TermsCheckbox checked={termos} onChange={(v) => { setTermos(v); clearErr("termos"); }} error={errors.termos} />
            <GoldDivider />
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onBack} className="twala-btn-outline flex-1" style={{ padding: "12px 20px", fontSize: 14 }}>
                Cancelar
              </button>
              <div className="flex-1">
                <SubmitButton loading={isLoading} label="Criar Conta →" loadingLabel="A criar..." />
              </div>
            </div>
          </form>

          <div className="mt-6 pt-5 text-center" style={{ borderTop: "1px solid rgba(44,85,48,0.08)" }}>
            <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 14, color: "#5a6b5a" }}>
              Já tem conta?{" "}
              <Link to="/login" style={{ color: GREEN, fontWeight: 600 }}>Entrar</Link>
            </p>
          </div>
      </div>
    </div>
  );
}

// ─── Etapa 2 ──────────────────────────────────────────────────────────────────
function Step2({ step1Data, onBack }: { step1Data: Step1Data; onBack: () => void }) {
  const navigate = useNavigate();
  const ANO_ATUAL = new Date().getFullYear();

  // Seção 1 — Informações pessoais
  const [nome,          setNome]          = useState(step1Data.nome);
  const [numeroBi,      setNumeroBi]      = useState("");
  const [dataNasc,      setDataNasc]      = useState("");
  const [endereco,      setEndereco]      = useState("");
  const [provincia,     setProvincia]     = useState("");
  const [municipio,     setMunicipio]     = useState("");
  const [bairro,        setBairro]        = useState("");

  // Seção 2 — Moto
  const [marcaMoto,     setMarcaMoto]     = useState("");
  const [modeloMoto,    setModeloMoto]    = useState("");
  const [corMoto,       setCorMoto]       = useState("");
  const [anoMoto,       setAnoMoto]       = useState("");
  const [matricula,     setMatricula]     = useState("");

  // Seção 3 — Documentos
  const [docBi,         setDocBi]         = useState<UploadedFile | null>(null);
  const [docCarta,      setDocCarta]      = useState<UploadedFile | null>(null);
  const [docLivrete,    setDocLivrete]    = useState<UploadedFile | null>(null);
  const [docFoto,       setDocFoto]       = useState<UploadedFile | null>(null);

  // Seção 4 — Pagamento (opcional)
  const [banco,         setBanco]         = useState("");
  const [iban,          setIban]          = useState("");

  const [errors,        setErrors]        = useState<Record<string, string>>({});
  const [isLoading,     setIsLoading]     = useState(false);
  const [submitted,     setSubmitted]     = useState(false);
  const [toast,         setToast]         = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const clearErr = (k: string) => setErrors((p) => { const n = { ...p }; delete n[k]; return n; });

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!nome.trim())      e.nome      = "Nome é obrigatório";
    if (!numeroBi.trim())  e.numeroBi  = "Número do BI é obrigatório";
    if (!dataNasc)         e.dataNasc  = "Data de nascimento é obrigatória";
    if (!endereco.trim())  e.endereco  = "Endereço é obrigatório";
    if (!provincia)        e.provincia = "Selecione a província";
    if (!municipio)        e.municipio = "Selecione o município";
    if (!bairro.trim())    e.bairro    = "Bairro é obrigatório";
    if (!marcaMoto.trim()) e.marcaMoto = "Marca da moto é obrigatória";
    if (!modeloMoto.trim()) e.modeloMoto = "Modelo é obrigatório";
    if (!matricula.trim()) e.matricula = "Matrícula é obrigatória";
    if (!docBi)            e.docBi     = "Documento obrigatório";
    if (!docCarta)         e.docCarta  = "Documento obrigatório";
    if (!docLivrete)       e.docLivrete = "Documento obrigatório";
    if (!docFoto)          e.docFoto   = "Fotografia obrigatória";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const adicionarEntregador = useEntregadoresAdminStore((s) => s.adicionarEntregador);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      document.querySelector("[data-field-error]")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));

      const documentos = [
        { label: "BI", preview: docBi?.preview ?? null, fileName: docBi?.file?.name },
        { label: "Carta de Condução", preview: docCarta?.preview ?? null, fileName: docCarta?.file?.name },
        { label: "Livrete", preview: docLivrete?.preview ?? null, fileName: docLivrete?.file?.name },
        { label: "Fotografia", preview: docFoto?.preview ?? null, fileName: docFoto?.file?.name },
      ];
      adicionarEntregador({
        nome,
        email: step1Data.email,
        telefone: step1Data.telefone,
        tipoVeiculo: "Moto",
        documentos,
        numeroBi,
        dataNasc,
        endereco,
        provincia,
        municipio,
        bairro,
        marcaMoto,
        modeloMoto,
        corMoto,
        anoMoto,
        matricula,
      });

      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error("Erro ao enviar cadastro:", err);
      setToast({ type: "error", msg: "Ocorreu um erro ao enviar. Tente novamente." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = () => {
    setToast({ type: "success", msg: "Rascunho guardado com sucesso!" });
  };

  if (submitted) {
    return (
      <div className="min-h-screen twala-page-enter" style={{ backgroundColor: "#faf7f2" }}>
        <StepPageHeader onBack={() => {}} stepLabel="Cadastro enviado" />
        <div className="max-w-xl mx-auto p-6 mt-8">
          <SuccessBanner
            title="Cadastro enviado para verificação!"
            body="O seu cadastro foi enviado com sucesso. A nossa equipa irá verificar os seus documentos e aprovará a sua conta em breve. Receberá uma notificação por email quando o processo estiver concluído."
            onAction={() => navigate("/login")}
            actionLabel="Ir para o Login"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen twala-page-enter" style={{ backgroundColor: "#faf7f2" }}>
      {toast && <Toast type={toast.type} message={toast.msg} onClose={() => setToast(null)} />}

      <StepPageHeader onBack={onBack} stepLabel="Etapa 2 de 2" />

      <div className="max-w-3xl mx-auto p-5 pb-12">

        <div className="rounded-2xl p-6 mb-5"
          style={{ backgroundColor: "#fff", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid rgba(44,85,48,0.08)" }}>
          <ProgressBar step={2} total={2} labels={["Criar Conta", "Documentos"]} />
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 19, color: "#2c3e2c" }}>
            Informações Pessoais e Documentos
          </h2>
          <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 13, color: "#5a6b5a", marginTop: 4 }}>
            Preencha os dados complementares e envie os documentos exigidos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Seção 1 — Informações do Entregador */}
          <div className="rounded-2xl p-6"
            style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1px solid rgba(44,85,48,0.08)" }}>
            <SectionTitle icon={User} label="Informações do Entregador" />
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div data-field-error={errors.nome || undefined}>
                  <FieldInput label="Nome completo" required value={nome} onChange={(v) => { setNome(v); clearErr("nome"); }} placeholder="Seu nome completo" error={errors.nome} />
                </div>
                <div data-field-error={errors.numeroBi || undefined}>
                  <FieldInput label="Número do BI" required value={numeroBi} onChange={(v) => { setNumeroBi(v); clearErr("numeroBi"); }} placeholder="00xxxxxxxxLA000" error={errors.numeroBi} hint="Bilhete de Identidade Angolano" />
                </div>
              </div>
              <div data-field-error={errors.dataNasc || undefined}>
                <FieldInput label="Data de nascimento" required type="date" value={dataNasc} onChange={(v) => { setDataNasc(v); clearErr("dataNasc"); }} error={errors.dataNasc} />
              </div>
              <div data-field-error={errors.endereco || undefined}>
                <FieldInput label="Endereço completo" required value={endereco} onChange={(v) => { setEndereco(v); clearErr("endereco"); }} placeholder="Rua, Nº, Bairro..." error={errors.endereco} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div data-field-error={errors.provincia || undefined}>
                  <SelectProvincia required value={provincia} onChange={(v) => { setProvincia(v); setMunicipio(""); clearErr("provincia"); }} error={errors.provincia} />
                </div>
                <div data-field-error={errors.municipio || undefined}>
                  <SelectMunicipio required provincia={provincia} value={municipio} onChange={(v) => { setMunicipio(v); clearErr("municipio"); }} error={errors.municipio} />
                </div>
              </div>
              <div data-field-error={errors.bairro || undefined}>
                <FieldInput label="Bairro" required value={bairro} onChange={(v) => { setBairro(v); clearErr("bairro"); }} placeholder="Nome do bairro" error={errors.bairro} />
              </div>
            </div>
          </div>

          {/* Seção 2 — Moto */}
          <div className="rounded-2xl p-6"
            style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1px solid rgba(44,85,48,0.08)" }}>
            <SectionTitle icon={Bike} label="Informações da Motocicleta" />
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div data-field-error={errors.marcaMoto || undefined}>
                  <FieldInput label="Marca" required value={marcaMoto} onChange={(v) => { setMarcaMoto(v); clearErr("marcaMoto"); }} placeholder="Honda, Yamaha..." error={errors.marcaMoto} />
                </div>
                <div data-field-error={errors.modeloMoto || undefined}>
                  <FieldInput label="Modelo" required value={modeloMoto} onChange={(v) => { setModeloMoto(v); clearErr("modeloMoto"); }} placeholder="CG 150, Factor..." error={errors.modeloMoto} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FieldInput label="Cor" value={corMoto} onChange={setCorMoto} placeholder="Vermelho, Preto..." />
                <FieldInput
                  label="Ano" type="number"
                  value={anoMoto} onChange={setAnoMoto}
                  placeholder={String(ANO_ATUAL)}
                  hint={`2000 – ${ANO_ATUAL + 1}`}
                />
                <div data-field-error={errors.matricula || undefined}>
                  <FieldInput label="Matrícula" required value={matricula} onChange={(v) => { setMatricula(v); clearErr("matricula"); }} placeholder="LD-00-00-AX" error={errors.matricula} />
                </div>
              </div>
            </div>
          </div>

          {/* Seção 3 — Documentos */}
          <div className="rounded-2xl p-6"
            style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1px solid rgba(44,85,48,0.08)" }}>
            <SectionTitle icon={FileText} label="Upload de Documentos" />
            <p className="mb-5" style={{ fontFamily: "'Roboto',sans-serif", fontSize: 12, color: "#9aab9a" }}>
              Formatos aceites: PDF, JPG, PNG · Tamanho máximo: 5 MB por ficheiro
            </p>
            <UploadGrid>
              <div data-field-error={errors.docBi || undefined}>
                <UploadField label="Bilhete de Identidade (BI)" required value={docBi} onChange={setDocBi} error={errors.docBi} />
              </div>
              <div data-field-error={errors.docCarta || undefined}>
                <UploadField label="Carta de Condução (Cat. A / A1)" required value={docCarta} onChange={setDocCarta} error={errors.docCarta} />
              </div>
              <div data-field-error={errors.docLivrete || undefined}>
                <UploadField label="Documento da Moto (Livrete)" required value={docLivrete} onChange={setDocLivrete} error={errors.docLivrete} />
              </div>
              <div data-field-error={errors.docFoto || undefined}>
                <UploadField
                  label="Fotografia do Entregador" required
                  accept=".jpg,.jpeg,.png"
                  value={docFoto} onChange={setDocFoto}
                  error={errors.docFoto}
                  hint="JPG ou PNG · Foto de rosto nítida"
                />
              </div>
            </UploadGrid>
          </div>

          {/* Seção 4 — Pagamento (opcional) */}
          <div className="rounded-2xl p-6"
            style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1px solid rgba(44,85,48,0.08)" }}>
            <SectionTitle icon={CreditCard} label="Informações de Pagamento (Opcional)" />
            <p className="mb-4" style={{ fontFamily: "'Roboto',sans-serif", fontSize: 12, color: "#9aab9a" }}>
              Preencha para receber os seus ganhos directamente na conta bancária.
            </p>
            <div className="space-y-4">
              {/* Select de banco */}
              <div>
                <label className="block mb-1.5" style={{ fontFamily: "'Roboto',sans-serif", fontSize: 13, fontWeight: 500, color: "#2c3e2c" }}>
                  Banco
                </label>
                <div className="relative">
                  <select
                    value={banco} onChange={(e) => setBanco(e.target.value)}
                    className="twala-input w-full appearance-none"
                    style={{ paddingRight: 36 }}
                  >
                    <option value="">Selecionar banco</option>
                    {BANCOS_ANGOLA.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <ChevronDown style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#9aab9a", pointerEvents: "none" }} />
                </div>
              </div>
              <FieldInput
                label="IBAN"
                value={iban} onChange={setIban}
                placeholder="AO06 XXXX XXXX XXXX XXXX XXXX X"
                hint="Número Internacional de Conta Bancária"
              />
            </div>
          </div>

          {/* Botões finais */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button type="button" onClick={handleSaveDraft}
              className="twala-btn-outline"
              style={{ padding: "12px 24px", fontSize: 14 }}>
              <UploadIcon style={{ width: 14, height: 14, display: "inline", marginRight: 6 }} />
              Guardar Rascunho
            </button>
            <div className="flex-1">
              <SubmitButton loading={isLoading} label="Enviar para Verificação" loadingLabel="A enviar..." />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Orquestrador Entregador ──────────────────────────────────────────────────
export function EntregadorRegister({ onBack }: { onBack: () => void }) {
  const [step, setStep]         = useState<1 | 2>(1);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);

  if (step === 1) {
    return (
      <Step1
        onBack={onBack}
        onNext={(d) => { setStep1Data(d); setStep(2); window.scrollTo(0, 0); }}
      />
    );
  }
  return <Step2 step1Data={step1Data!} onBack={() => { setStep(1); window.scrollTo(0, 0); }} />;
}
