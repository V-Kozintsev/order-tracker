const crypto = require("crypto");

function generateSecureToken(length = 64) {
  return crypto.randomBytes(length).toString("hex");
}

const token = generateSecureToken();
console.log("Сгенерированный токен:", token);
