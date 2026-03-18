import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, MapPin, User, FileText, Upload as UploadIcon } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useFarmaciasStore } from "../../store/farmaciasStore";
import {
  GoldDivider, ProgressBar, FieldInput, PasswordInput,
  PasswordRules, TermsCheckbox, SubmitButton, SelectProvincia, SelectMunicipio,
  UploadField, UploadGrid, Toast, SuccessBanner, SectionTitle, StepPageHeader,
  GREEN, GOLD, RED,
  formatPhone, validateEmail, passwordValid,
  type UploadedFile,
} from "./shared";

// ─── Etapa 1 ──────────────────────────────────────────────────────────────────
interface Step1Data {
  nomeFarmacia: string;
  email:        string;
  telefone:     string;
  whatsapp:     string;
  password:     string;
  confirmPassword: string;
}

function Step1({ onBack, onNext }: { onBack: () => void; onNext: (d: Step1Data) => void }) {
  const { register } = useAuth();

  const [nomeFarmacia,    setNomeFarmacia]    = useState("");
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
    if (!nomeFarmacia.trim())         e.nomeFarmacia    = "Nome da farmácia é obrigatório";
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
        nome: nomeFarmacia, email, telefone,
        password, confirmPassword, tipo: "farmacia",
      } as Parameters<typeof register>[0]);

      if (!result.success) {
        setToast({ type: "error", msg: result.message });
        return;
      }

      setToast({ type: "success", msg: "Conta criada com sucesso! Agora complete o cadastro da sua farmácia." });
      setTimeout(() => onNext({ nomeFarmacia, email, telefone, whatsapp, password, confirmPassword }), 1500);
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

          {/* Progresso */}
          <ProgressBar step={1} total={2} labels={["Criar Conta", "Completar Cadastro"]} />

          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, color: "#2c3e2c", fontSize: 20 }}>
                Informações da Conta
              </h2>
              <p style={{ fontFamily: "'Roboto',sans-serif", color: "#5a6b5a", fontSize: 13, marginTop: 3 }}>
                Crie o acesso da sua farmácia à plataforma
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
              label="Nome da farmácia" required
              value={nomeFarmacia} onChange={(v) => { setNomeFarmacia(v); clearErr("nomeFarmacia"); }}
              placeholder="Farmácia Central Luanda"
              error={errors.nomeFarmacia}
            />
            <FieldInput
              label="Email de contacto" required type="email"
              value={email} onChange={(v) => { setEmail(v); clearErr("email"); }}
              placeholder="contato@farmacia.com"
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
              <FieldInput
                label="WhatsApp (opcional)"
                value={whatsapp} onChange={(v) => setWhatsapp(formatPhone(v))}
                placeholder="9XX XXX XXX"
                hint="Recomendado para notificações"
                inputMode="numeric"
              />
            </div>
            <PasswordInput
              label="Criar senha" required
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
  const { adicionarFarmacia } = useFarmaciasStore();

  // Seção 1 — Empresa
  const [nomeEmpresa,     setNomeEmpresa]     = useState(step1Data.nomeFarmacia);
  const [nif,             setNif]             = useState("");
  const [registroComercial, setRegistroComercial] = useState("");
  const [licencaFunc,     setLicencaFunc]     = useState("");
  const [alvaraComercial, setAlvaraComercial] = useState("");
  const [licencaSanitaria, setLicencaSanitaria] = useState("");
  const [anoFundacao,     setAnoFundacao]     = useState("");

  // Seção 2 — Localização
  const [provincia,  setProvincia]  = useState("");
  const [municipio,  setMunicipio]  = useState("");
  const [bairro,     setBairro]     = useState("");
  const [rua,        setRua]        = useState("");
  const [numEdificio, setNumEdificio] = useState("");
  const [referencia, setReferencia] = useState("");

  // Seção 3 — Farmacêutico
  const [farmNome,   setFarmNome]   = useState("");
  const [farmCedula, setFarmCedula] = useState("");
  const [farmTel,    setFarmTel]    = useState("");
  const [farmEmail,  setFarmEmail]  = useState("");

  // Seção 4 — Documentos
  const [docLicencaFunc,     setDocLicencaFunc]     = useState<UploadedFile | null>(null);
  const [docAlvara,          setDocAlvara]          = useState<UploadedFile | null>(null);
  const [docRegistroComercial, setDocRegistroComercial] = useState<UploadedFile | null>(null);
  const [docLicencaSanitaria, setDocLicencaSanitaria] = useState<UploadedFile | null>(null);
  const [docNif,             setDocNif]             = useState<UploadedFile | null>(null);
  const [docCedula,          setDocCedula]          = useState<UploadedFile | null>(null);

  const [errors,     setErrors]     = useState<Record<string, string>>({});
  const [isLoading,  setIsLoading]  = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [toast,      setToast]      = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const clearErr = (k: string) => setErrors((p) => { const n = { ...p }; delete n[k]; return n; });

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!nomeEmpresa.trim())     e.nomeEmpresa    = "Nome da empresa é obrigatório";
    if (!nif.trim())             e.nif            = "NIF é obrigatório";
    if (!licencaFunc.trim())     e.licencaFunc    = "Nº da licença é obrigatório";
    if (!provincia)              e.provincia      = "Selecione a província";
    if (!municipio)              e.municipio      = "Selecione o município";
    if (!bairro.trim())          e.bairro         = "Bairro é obrigatório";
    if (!rua.trim())             e.rua            = "Rua/Avenida é obrigatória";
    if (!farmNome.trim())        e.farmNome       = "Nome do farmacêutico é obrigatório";
    if (!farmCedula.trim())      e.farmCedula     = "Cédula profissional é obrigatória";
    if (!farmTel.trim())         e.farmTel        = "Telefone do farmacêutico é obrigatório";
    if (!docLicencaFunc)         e.docLicencaFunc = "Documento obrigatório";
    if (!docNif)                 e.docNif         = "Documento obrigatório";
    if (!docCedula)              e.docCedula      = "Documento obrigatório";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      document.querySelector("[data-field-error]")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));

    // Guardar farmácia na store com status pendente de aprovação admin (inclui documentos para o admin ver)
    const documentosCadastro = [
      { label: "Licença de Funcionamento", preview: docLicencaFunc?.preview ?? null, fileName: docLicencaFunc?.file?.name },
      { label: "Alvará Comercial", preview: docAlvara?.preview ?? null, fileName: docAlvara?.file?.name },
      { label: "Certificado de Registo Comercial", preview: docRegistroComercial?.preview ?? null, fileName: docRegistroComercial?.file?.name },
      { label: "Licença Sanitária", preview: docLicencaSanitaria?.preview ?? null, fileName: docLicencaSanitaria?.file?.name },
      { label: "Documento do NIF", preview: docNif?.preview ?? null, fileName: docNif?.file?.name },
      { label: "Cédula Profissional do Farmacêutico", preview: docCedula?.preview ?? null, fileName: docCedula?.file?.name },
    ];
    adicionarFarmacia({
      nome: nomeEmpresa,
      email: step1Data.email,
      telefone: step1Data.telefone,
      provincia,
      municipio,
      bairro,
      rua,
      numEdificio,
      nif,
      licencaFuncionamento: licencaFunc,
      horarioAbertura: "08:00",
      horarioFechamento: "18:00",
      farmaceuticoNome: farmNome,
      farmaceuticoCedula: farmCedula,
      farmaceuticoTel: farmTel,
      documentosCadastro,
    });

    setIsLoading(false);
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  const handleSaveDraft = () => {
    setToast({ type: "success", msg: "Rascunho guardado com sucesso!" });
  };

  const ANO_ATUAL = new Date().getFullYear();

  if (submitted) {
    return (
      <div className="min-h-screen twala-page-enter" style={{ backgroundColor: "#faf7f2" }}>
        <StepPageHeader onBack={() => {}} stepLabel="Cadastro enviado" />
        <div className="max-w-xl mx-auto p-6 mt-8">
          <SuccessBanner
            title="Cadastro enviado para análise!"
            body="O seu cadastro foi enviado com sucesso. A nossa equipa irá verificar os documentos antes de aprovar a sua farmácia. Receberá uma notificação por email assim que o processo estiver concluído."
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
          <ProgressBar step={2} total={2} labels={["Criar Conta", "Completar Cadastro"]} />
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 19, color: "#2c3e2c" }}>
            Informações e Documentos da Farmácia
          </h2>
          <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 13, color: "#5a6b5a", marginTop: 4 }}>
            Complete o seu perfil para que a equipa TwalaCare possa analisar e aprovar o cadastro.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">

          {/* Seção 1 — Empresa */}
          <div className="rounded-2xl p-6"
            style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1px solid rgba(44,85,48,0.08)" }}>
            <SectionTitle icon={Building2} label="Informações da Empresa" />
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div data-field-error={errors.nomeEmpresa || undefined}>
                  <FieldInput
                    label="Nome da empresa" required
                    value={nomeEmpresa} onChange={(v) => { setNomeEmpresa(v); clearErr("nomeEmpresa"); }}
                    placeholder="Nome da empresa registada"
                    error={errors.nomeEmpresa}
                  />
                </div>
                <div data-field-error={errors.nif || undefined}>
                  <FieldInput
                    label="NIF" required
                    value={nif} onChange={(v) => { setNif(v); clearErr("nif"); }}
                    placeholder="5400000000LA040"
                    error={errors.nif}
                    hint="Número de Identificação Fiscal"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FieldInput
                  label="Nº do Registo Comercial"
                  value={registroComercial} onChange={setRegistroComercial}
                  placeholder="RC-XXXX-XXXX"
                />
                <div data-field-error={errors.licencaFunc || undefined}>
                  <FieldInput
                    label="Nº da Licença de Funcionamento" required
                    value={licencaFunc} onChange={(v) => { setLicencaFunc(v); clearErr("licencaFunc"); }}
                    placeholder="LF-XXXX-XXXX"
                    error={errors.licencaFunc}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FieldInput
                  label="Nº do Alvará Comercial"
                  value={alvaraComercial} onChange={setAlvaraComercial}
                  placeholder="AV-XXXX"
                />
                <FieldInput
                  label="Nº da Licença Sanitária"
                  value={licencaSanitaria} onChange={setLicencaSanitaria}
                  placeholder="LS-XXXX"
                />
                <FieldInput
                  label="Ano de Fundação"
                  type="number"
                  value={anoFundacao} onChange={setAnoFundacao}
                  placeholder={String(ANO_ATUAL)}
                  hint={`Entre 1900 e ${ANO_ATUAL}`}
                />
              </div>
            </div>
          </div>

          {/* Seção 2 — Localização */}
          <div className="rounded-2xl p-6"
            style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1px solid rgba(44,85,48,0.08)" }}>
            <SectionTitle icon={MapPin} label="Localização da Farmácia" />
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div data-field-error={errors.provincia || undefined}>
                  <SelectProvincia required value={provincia} onChange={(v) => { setProvincia(v); setMunicipio(""); clearErr("provincia"); }} error={errors.provincia} />
                </div>
                <div data-field-error={errors.municipio || undefined}>
                  <SelectMunicipio required provincia={provincia} value={municipio} onChange={(v) => { setMunicipio(v); clearErr("municipio"); }} error={errors.municipio} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div data-field-error={errors.bairro || undefined}>
                  <FieldInput label="Bairro" required value={bairro} onChange={(v) => { setBairro(v); clearErr("bairro"); }} placeholder="Nome do bairro" error={errors.bairro} />
                </div>
                <div data-field-error={errors.rua || undefined}>
                  <FieldInput label="Rua / Avenida" required value={rua} onChange={(v) => { setRua(v); clearErr("rua"); }} placeholder="Rua da Missão" error={errors.rua} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FieldInput label="Número do Edifício" value={numEdificio} onChange={setNumEdificio} placeholder="Nº 45" />
                <FieldInput label="Referência (opcional)" value={referencia} onChange={setReferencia} placeholder="Próximo ao…" />
              </div>
            </div>
          </div>

          {/* Seção 3 — Farmacêutico */}
          <div className="rounded-2xl p-6"
            style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1px solid rgba(44,85,48,0.08)" }}>
            <SectionTitle icon={User} label="Farmacêutico Responsável" />
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div data-field-error={errors.farmNome || undefined}>
                  <FieldInput label="Nome completo" required value={farmNome} onChange={(v) => { setFarmNome(v); clearErr("farmNome"); }} placeholder="Dr(a). Nome Completo" error={errors.farmNome} />
                </div>
                <div data-field-error={errors.farmCedula || undefined}>
                  <FieldInput label="Nº da Cédula Profissional" required value={farmCedula} onChange={(v) => { setFarmCedula(v); clearErr("farmCedula"); }} placeholder="ORF-XXXXXX" error={errors.farmCedula} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div data-field-error={errors.farmTel || undefined}>
                  <FieldInput label="Telefone" required value={farmTel} onChange={(v) => { setFarmTel(formatPhone(v)); clearErr("farmTel"); }} placeholder="9XX XXX XXX" error={errors.farmTel} inputMode="numeric" />
                </div>
                <FieldInput label="Email" type="email" value={farmEmail} onChange={setFarmEmail} placeholder="farmaceutico@farmacia.com" />
              </div>
            </div>
          </div>

          {/* Seção 4 — Documentos */}
          <div className="rounded-2xl p-6"
            style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1px solid rgba(44,85,48,0.08)" }}>
            <SectionTitle icon={FileText} label="Upload de Documentos" />
            <p className="mb-5" style={{ fontFamily: "'Roboto',sans-serif", fontSize: 12, color: "#9aab9a" }}>
              Formatos aceites: PDF, JPG, PNG · Tamanho máximo: 5 MB por ficheiro
            </p>
            <UploadGrid>
              <div data-field-error={errors.docLicencaFunc || undefined}>
                <UploadField label="Licença de Funcionamento" required value={docLicencaFunc} onChange={setDocLicencaFunc} error={errors.docLicencaFunc} />
              </div>
              <UploadField label="Alvará Comercial" value={docAlvara} onChange={setDocAlvara} />
              <UploadField label="Certificado de Registo Comercial" value={docRegistroComercial} onChange={setDocRegistroComercial} />
              <UploadField label="Licença Sanitária" value={docLicencaSanitaria} onChange={setDocLicencaSanitaria} />
              <div data-field-error={errors.docNif || undefined}>
                <UploadField label="Documento do NIF" required value={docNif} onChange={setDocNif} error={errors.docNif} />
              </div>
              <div data-field-error={errors.docCedula || undefined}>
                <UploadField label="Cédula Profissional do Farmacêutico" required value={docCedula} onChange={setDocCedula} error={errors.docCedula} />
              </div>
            </UploadGrid>
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
              <SubmitButton loading={isLoading} label="Enviar para Análise" loadingLabel="A enviar..." />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Orquestrador Farmácia ────────────────────────────────────────────────────
export function FarmaciaRegister({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
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
