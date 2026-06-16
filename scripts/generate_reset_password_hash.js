const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

// Config
const PASSWORD = process.env.TEST_PASSWORD || 'Test1234!';
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10', 10);
const templatePath = path.join(__dirname, '..', 'migrations', 'reset_test_passwords.sql.template');
const outPath = path.join(__dirname, '..', 'migrations', 'reset_test_passwords.sql');

async function main() {
  if (!fs.existsSync(templatePath)) {
    console.error('Template not found:', templatePath);
    process.exit(1);
  }

  const hash = await bcrypt.hash(PASSWORD, SALT_ROUNDS);
  const template = fs.readFileSync(templatePath, 'utf8');
  const filled = template.replace(/{{NEW_BCRYPT_HASH}}/g, "'" + hash.replace(/'/g, "''") + "'");

  fs.writeFileSync(outPath, filled, 'utf8');
  console.log('Wrote:', outPath);
  console.log('Password used:', PASSWORD);
  console.log('Bcrypt hash generated (length):', hash.length);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
