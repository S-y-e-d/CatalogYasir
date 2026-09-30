const bcrypt = require("bcrypt");

async function login(password) {
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!passwordHash) {
    throw new Error("ADMIN_PASSWORD_HASH is not configured");
  }

  return bcrypt.compare(password, passwordHash);
}

module.exports = {
  login,
};
