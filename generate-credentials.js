const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const credentialsFile = path.join(__dirname, "flows_cred.json");
const secret = process.env.NODE_RED_CREDENTIAL_SECRET;
const brokerId = process.env.MQTT_CREDENTIALS_NODE_ID || "broker_emqx";
const mqttUser = process.env.MQTT_USER;
const mqttPassword = process.env.MQTT_PASSWORD;

if (!secret) {
  console.error("Falta NODE_RED_CREDENTIAL_SECRET");
  process.exit(1);
}
if (!mqttUser) {
  console.error("Falta MQTT_USER");
  process.exit(1);
}
if (mqttPassword === undefined) {
  console.error("Falta MQTT_PASSWORD");
  process.exit(1);
}

const algorithm = "aes-256-ctr";
const key = crypto.createHash("sha256").update(secret).digest();

function decryptCredentials(raw) {
  if (raw && typeof raw === "object" && raw.$) {
    const payload = raw.$;
    const initVector = Buffer.from(payload.substring(0, 32), "hex");
    const decipher = crypto.createDecipheriv(algorithm, key, initVector);
    const decrypted =
      decipher.update(payload.substring(32), "base64", "utf8") +
      decipher.final("utf8");
    return JSON.parse(decrypted);
  }
  return raw;
}

let credentials = {};
if (fs.existsSync(credentialsFile)) {
  try {
    const raw = JSON.parse(fs.readFileSync(credentialsFile, "utf8"));
    credentials = decryptCredentials(raw) || {};
  } catch (error) {
    console.warn(
      "No se pudieron leer las credenciales existentes; se recrearán: " +
        error.message
    );
  }
}

credentials[brokerId] = {
  user: mqttUser,
  password: mqttPassword,
};

const initVector = crypto.randomBytes(16);
const cipher = crypto.createCipheriv(algorithm, key, initVector);
const encrypted = {
  $:
    initVector.toString("hex") +
    cipher.update(JSON.stringify(credentials), "utf8", "base64") +
    cipher.final("base64"),
};

fs.writeFileSync(credentialsFile, JSON.stringify(encrypted, null, 4), {
  mode: 0o600,
});
console.log(`Credenciales MQTT actualizadas para ${brokerId} en ${credentialsFile}`);
