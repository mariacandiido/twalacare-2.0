/**
 * emailService.js
 * Serviço central de envio de e-mails do TwalaCare.
 * Utiliza Nodemailer com suporte a Gmail / SMTP genérico.
 */
const nodemailer = require('nodemailer');

/**
 * Cria o transporter com base nas variáveis de ambiente.
 * Para desenvolvimento, usa Ethereal (servidor de teste gratuito).
 */
function createTransporter() {
  const host = process.env.EMAIL_HOST;
  
  // Se não houver config de e-mail real, usa Ethereal test account
  if (!host) {
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.EMAIL_USER || 'test@ethereal.email',
        pass: process.env.EMAIL_PASS || 'testpassword',
      },
    });
  }

  return nodemailer.createTransport({
    host,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

const transporter = createTransporter();

// ─── HTML Templates ───────────────────────────────────────────────────────────

function baseLayout(content) {
  return `
  <!DOCTYPE html>
  <html lang="pt">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>TwalaCare</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f6f9;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:30px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.08);overflow:hidden;max-width:600px;width:100%;">
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#14b8a6 0%,#0d9488 100%);padding:36px 40px;text-align:center;">
                <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;letter-spacing:-0.5px;">💊 TwalaCare</h1>
                <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">Saúde ao alcance de todos</p>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:40px;color:#374151;">
                ${content}
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:24px 40px;text-align:center;">
                <p style="color:#9ca3af;font-size:12px;margin:0;">© ${new Date().getFullYear()} TwalaCare · Todos os direitos reservados</p>
                <p style="color:#9ca3af;font-size:12px;margin:6px 0 0;">Luanda, Angola · suporte@twalacare.com</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}

function welcomeTemplate({ nome, tipo }) {
  const tipoLabels = {
    CLIENTE: 'Cliente',
    FARMACIA: 'Farmácia',
    ENTREGADOR: 'Entregador',
    ADMIN: 'Administrador',
  };

  const tipoDesc = {
    CLIENTE: 'Agora você pode pesquisar farmácias, encomendar medicamentos e acompanhar as suas compras em tempo real.',
    FARMACIA: 'A sua conta está a ser verificada pela nossa equipa. Em breve receberá a confirmação de ativação e poderá gerir o seu catálogo de medicamentos.',
    ENTREGADOR: 'Bem-vindo à nossa rede de entregas! Assim que a sua conta for aprovada, poderá começar a aceitar missões de entrega.',
    ADMIN: 'A sua conta de administrador foi criada com sucesso.',
  };

  return baseLayout(`
    <h2 style="color:#0d9488;margin:0 0 8px;font-size:22px;">Olá, ${nome}! 👋</h2>
    <p style="color:#6b7280;margin:0 0 24px;font-size:15px;">Seja muito bem-vindo(a) ao <strong style="color:#0d9488;">TwalaCare</strong>!</p>
    
    <div style="background:#f0fdfa;border-left:4px solid #14b8a6;border-radius:6px;padding:18px 20px;margin-bottom:24px;">
      <p style="margin:0;color:#374151;font-size:15px;line-height:1.6;">
        Somos uma plataforma que conecta <strong>clientes</strong>, <strong>farmácias</strong> e <strong>entregadores</strong> 
        para facilitar a compra e entrega de medicamentos de forma <em>segura e rápida</em>.
      </p>
    </div>

    <p style="color:#374151;font-size:15px;margin:0 0 12px;"><strong>Tipo de conta:</strong> 
      <span style="background:#ccfbf1;color:#0f766e;padding:2px 10px;border-radius:20px;font-size:14px;">${tipoLabels[tipo] || tipo}</span>
    </p>
    
    <p style="color:#4b5563;font-size:15px;margin:0 0 28px;line-height:1.6;">${tipoDesc[tipo] || ''}</p>

    <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;" />
    
    <p style="color:#6b7280;font-size:14px;margin:0;">Precisa de ajuda? Entre em contacto pela nossa equipa de suporte em 
      <a href="mailto:suporte@twalacare.com" style="color:#0d9488;text-decoration:none;">suporte@twalacare.com</a>
    </p>
  `);
}

function resetPasswordTemplate({ nome, resetLink }) {
  return baseLayout(`
    <h2 style="color:#0d9488;margin:0 0 8px;font-size:22px;">Redefinição de Senha 🔐</h2>
    <p style="color:#6b7280;margin:0 0 24px;font-size:15px;">Olá, <strong>${nome}</strong>! Recebemos um pedido para redefinir a senha da sua conta.</p>
    
    <div style="background:#fff7ed;border-left:4px solid #f97316;border-radius:6px;padding:18px 20px;margin-bottom:28px;">
      <p style="margin:0;color:#374151;font-size:14px;line-height:1.6;">
        ⚠️ Se não foi você quem solicitou esta alteração, pode ignorar este e-mail. A sua senha permanece inalterada.
      </p>
    </div>

    <p style="color:#4b5563;font-size:15px;margin:0 0 24px;line-height:1.6;">
      Clique no botão abaixo para criar uma nova senha. Este link expira em <strong>30 minutos</strong>.
    </p>
    
    <div style="text-align:center;margin:32px 0;">
      <a href="${resetLink}" 
         style="background:linear-gradient(135deg,#14b8a6,#0d9488);color:#ffffff;text-decoration:none;
                padding:14px 36px;border-radius:8px;font-size:16px;font-weight:600;
                display:inline-block;letter-spacing:0.3px;">
        Redefinir Senha
      </a>
    </div>
    
    <p style="color:#9ca3af;font-size:13px;margin:24px 0 0;text-align:center;">
      Ou copie e cole este link no navegador:<br/>
      <a href="${resetLink}" style="color:#0d9488;word-break:break-all;font-size:12px;">${resetLink}</a>
    </p>
  `);
}

// ─── Public Methods ────────────────────────────────────────────────────────────

/**
 * Envia e-mail de boas-vindas após registo.
 */
async function sendWelcomeEmail({ email, nome, tipo }) {
  const mailOptions = {
    from: `"TwalaCare" <${process.env.EMAIL_FROM || 'noreply@twalacare.com'}>`,
    to: email,
    subject: `Bem-vindo(a) ao TwalaCare, ${nome}!`,
    html: welcomeTemplate({ nome, tipo }),
    text: `Olá ${nome}, bem-vindo(a) ao TwalaCare! A plataforma que conecta clientes, farmácias e entregadores.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 E-mail de boas-vindas enviado para ${email}. ID: ${info.messageId}`);
    
    // Em ambiente de desenvolvimento mostra o URL de preview do Ethereal
    if (!process.env.EMAIL_HOST) {
      console.log(`🔗 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return info;
  } catch (err) {
    console.error(`❌ Erro ao enviar e-mail para ${email}:`, err.message);
    // Não bloqueamos o registo mesmo que o e-mail falhe
  }
}

/**
 * Envia e-mail com link de redefinição de senha.
 */
async function sendPasswordResetEmail({ email, nome, token }) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetLink = `${frontendUrl}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"TwalaCare" <${process.env.EMAIL_FROM || 'noreply@twalacare.com'}>`,
    to: email,
    subject: 'Redefinição de Senha - TwalaCare',
    html: resetPasswordTemplate({ nome, resetLink }),
    text: `Acesse o link para redefinir a sua senha: ${resetLink}. Este link expira em 30 minutos.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 E-mail de recuperação enviado para ${email}. ID: ${info.messageId}`);
    if (!process.env.EMAIL_HOST) {
      console.log(`🔗 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return info;
  } catch (err) {
    console.error(`❌ Erro ao enviar e-mail de recuperação para ${email}:`, err.message);
    throw new Error('Falha ao enviar o e-mail de recuperação');
  }
}

module.exports = { sendWelcomeEmail, sendPasswordResetEmail };
