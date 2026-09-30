const bcrypt = require("bcrypt");

const password = process.argv[2];

if (!password) {
  console.log("Usage: node create-password.js <password>");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);

console.log(hash);