const nodemailer = require("nodemailer");
const { logger } = require("./logger");

const mailUser = process.env.MAIL_USER;
const mailPassword = process.env.MAIL_PASSWORD;

if (!mailUser || !mailPassword) {
  logger.warn(
    "MAIL_USER or MAIL_PASSWORD not set. Mailer will not be able to send messages."
  );
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: mailUser,
    pass: mailPassword,
  },
});

async function sendMail({ to, subject, text, html, from }) {
  if (!mailUser || !mailPassword) {
    throw new Error(
      "Mail credentials not configured (MAIL_USER / MAIL_PASSWORD)"
    );
  }

  const mailOptions = {
    from: from || mailUser,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(
      `Mail sent to ${to} subject='${subject}' messageId=${info.messageId}`
    );
    return info;
  } catch (err) {
    logger.warn(`Failed to send mail to ${to}: ${err.message}`);
    throw err;
  }
}

// Small template helpers
function templateCheckin({
  passengerName,
  flightNumber,
  seat,
  departure,
  arrival,
  depTime,
  arrTime,
  date,
  ticketCode,
}) {
  const subject = `Check-in disponible — Vuelo ${flightNumber || ""}`.trim();

  const textParts = [];
  textParts.push(`Hola ${passengerName || ""},`);
  textParts.push(
    `Tu check-in para el vuelo ${flightNumber || "-"} está disponible.`
  );
  if (date) textParts.push(`Fecha: ${date}`);
  if (depTime) textParts.push(`Salida: ${depTime}`);
  if (arrTime) textParts.push(`Llegada: ${arrTime}`);
  if (departure || arrival)
    textParts.push(`Ruta: ${departure || "-"} → ${arrival || "-"}`);
  textParts.push(`Asiento: ${seat || "No asignado"}`);
  if (ticketCode) textParts.push(`Código de ticket: ${ticketCode}`);
  textParts.push("Buen viaje!");
  const text = textParts.join("\n");

  const html = `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>Check-in disponible</title>
      <style>
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial;background:#f6f8fb;margin:0;padding:20px}
        .card{background:#fff;max-width:720px;margin:20px auto;border-radius:10px;box-shadow:0 6px 18px rgba(32,41,57,0.08);overflow:hidden}
        .header{background:linear-gradient(90deg,#8b5cf6,#0ea5a4);color:#fff;padding:18px;text-align:center}
        .header h1{margin:0;font-size:18px}
        .content{padding:18px;color:#24303b}
        .muted{color:#6b7280;font-size:13px}
        .details{margin:12px 0}
        .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9}
        .label{color:#6b7280}
        .value{font-weight:700}
        .footer{font-size:12px;color:#7b8a93;text-align:center;padding:16px}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header"><h1>Check-in disponible</h1></div>
        <div class="content">
          <p>Hola <strong>${escapeHtml(passengerName || "")}</strong>,</p>
          <p class="muted">Tu check-in está disponible. Detalles del vuelo a continuación.</p>
          <div class="details">
            <div class="row"><div class="label">Vuelo:</div><div class="value">${escapeHtml(
              flightNumber || "-"
            )}</div></div>
            <div class="row"><div class="label">Ruta:</div><div class="value">${escapeHtml(
              departure || "-"
            )}&nbsp;→&nbsp;${escapeHtml(arrival || "-")}</div></div>
            <div class="row"><div class="label">Fecha:</div><div class="value">${escapeHtml(
              date || "-"
            )}</div></div>
            <div class="row"><div class="label">Salida:</div><div class="value">${escapeHtml(
              depTime || "-"
            )}</div></div>
            <div class="row"><div class="label">Llegada:</div><div class="value">${escapeHtml(
              arrTime || "-"
            )}</div></div>
            <div class="row"><div class="label">Asiento:</div><div class="value">${escapeHtml(
              seat || "No asignado"
            )}</div></div>
            ${
              ticketCode
                ? `<div class="row"><div class="label">Ticket:</div><div class="value">${escapeHtml(
                    ticketCode
                  )}</div></div>`
                : ""
            }
          </div>
          <p class="muted">Presenta este correo en el mostrador si es necesario. Si tienes preguntas, responde a este correo.</p>
          <div class="footer">Buen viaje y gracias por elegirnos.</div>
        </div>
      </div>
    </body>
  </html>`;

  return { subject, text, html };
}

function templateConfirmation({
  passengerName,
  bookingRef,
  amount,
  flightNumber,
  seat,
  ticketCode,
  departure,
  arrival,
  date,
}) {
  const subject = `Compra confirmada — Reserva ${bookingRef || ""}`.trim();

  const textParts = [];
  textParts.push(`Hola ${passengerName || ""},`);
  textParts.push(`Tu compra (ref ${bookingRef || "-"}) ha sido confirmada.`);
  if (ticketCode) textParts.push(`Código de ticket: ${ticketCode}`);
  if (flightNumber) textParts.push(`Vuelo: ${flightNumber}`);
  if (date) textParts.push(`Fecha: ${date}`);
  if (departure || arrival)
    textParts.push(`Ruta: ${departure || "-"} → ${arrival || "-"}`);
  textParts.push(`Asiento: ${seat || "No asignado"}`);
  textParts.push(`Total: ${amount || "-"}`);
  textParts.push("Gracias por volar con nosotros.");
  const text = textParts.join("\n");

  const html = `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>Compra confirmada</title>
      <style>
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial;background:#f6f8fb;margin:0;padding:20px}
        .card{background:#fff;max-width:820px;margin:20px auto;border-radius:10px;box-shadow:0 6px 18px rgba(32,41,57,0.08);overflow:hidden}
        .header{padding:20px;text-align:center;background:linear-gradient(90deg,#8b5cf6,#6366f1);color:#fff}
        .header h1{margin:0;font-size:18px}
        .content{padding:20px;color:#24303b}
        .muted{color:#6b7280;font-size:13px}
        .block{background:#f8fafc;padding:12px;border-radius:8px;margin:12px 0}
        .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9}
        .label{color:#6b7280}
        .value{font-weight:700}
        .footer{text-align:center;font-size:12px;color:#9ca3af;padding:16px}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header"><h1>Compra confirmada</h1></div>
        <div class="content">
          <p>Hola <strong>${escapeHtml(passengerName || "")}</strong>,</p>
          <p class="muted">Gracias por tu compra. Detalles principales de tu reserva:</p>
          <div class="block">
            <div class="row"><div class="label">Reserva:</div><div class="value">${escapeHtml(
              bookingRef || "-"
            )}</div></div>
            ${
              ticketCode
                ? `<div class="row"><div class="label">Ticket:</div><div class="value">${escapeHtml(
                    ticketCode
                  )}</div></div>`
                : ""
            }
            <div class="row"><div class="label">Vuelo:</div><div class="value">${escapeHtml(
              flightNumber || "-"
            )}</div></div>
            <div class="row"><div class="label">Ruta:</div><div class="value">${escapeHtml(
              departure || "-"
            )}&nbsp;→&nbsp;${escapeHtml(arrival || "-")}</div></div>
            <div class="row"><div class="label">Fecha:</div><div class="value">${escapeHtml(
              date || "-"
            )}</div></div>
            <div class="row"><div class="label">Asiento:</div><div class="value">${escapeHtml(
              seat || "No asignado"
            )}</div></div>
            <div class="row"><div class="label">Total:</div><div class="value">${escapeHtml(
              amount || "-"
            )}</div></div>
          </div>
          <p class="muted">Con este correo tienes un comprobante de pago. Si necesitas factura, responde con tus datos fiscales.</p>
          <div class="footer">¡Gracias por elegirnos y buen viaje!</div>
        </div>
      </div>
    </body>
  </html>`;

  return { subject, text, html };
}

// Small helper to escape basic HTML entities
function escapeHtml(str) {
  if (!str && str !== 0) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

module.exports = {
  sendMail,
  templateCheckin,
  templateConfirmation,
  transporter,
};
