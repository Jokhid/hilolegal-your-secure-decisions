function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("Leads");

    if (!sheet) {
      sheet = ss.insertSheet("Leads");
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Fecha",
        "Nombre",
        "Teléfono",
        "Email",
        "Interés",
        "Mensaje",
        "Origen"
      ]);
    }

    const data = JSON.parse(e.postData.contents || "{}");
    const submittedAt = new Date();
    const name = data.name || "";
    const phone = data.phone || "";
    const email = data.email || "";
    const interest = data.interest || data.topic || data.interes || data.servicio || "";
    const message = data.message || data.mensaje || data.comments || "";
    const origin = data.origin || "Web HiloLegal";

    sheet.appendRow([
      submittedAt,
      name,
      phone,
      email,
      interest,
      message,
      origin
    ]);

    const emailOptions = {
      to: "info@hilolegal.es",
      subject: "Nuevo formulario recibido - HiloLegal",
      name: "HiloLegal",
      body:
        "Nuevo formulario recibido en HiloLegal\n\n" +
        "Fecha: " + submittedAt + "\n" +
        "Nombre: " + name + "\n" +
        "Teléfono: " + phone + "\n" +
        "Email: " + email + "\n" +
        "Interés: " + interest + "\n" +
        "Mensaje: " + message + "\n" +
        "Origen: " + origin,
      htmlBody:
        "<h2>Nuevo formulario recibido en HiloLegal</h2>" +
        "<p><strong>Fecha:</strong> " + escapeHtml(submittedAt.toString()) + "</p>" +
        "<p><strong>Nombre:</strong> " + escapeHtml(name) + "</p>" +
        "<p><strong>Teléfono:</strong> " + escapeHtml(phone) + "</p>" +
        "<p><strong>Email:</strong> " + escapeHtml(email) + "</p>" +
        "<p><strong>Interés:</strong> " + escapeHtml(interest) + "</p>" +
        "<p><strong>Mensaje:</strong><br>" + escapeHtml(message).replace(/\n/g, "<br>") + "</p>" +
        "<p><strong>Origen:</strong> " + escapeHtml(origin) + "</p>"
    };

    if (email) {
      emailOptions.replyTo = email;
    }

    MailApp.sendEmail(emailOptions);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
