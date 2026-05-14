const bcrypt = require('bcryptjs');

const users = [
    { id: 7, pass: 'vday3627' },
    { id: 1, pass: 'barber_1_pass' },
    { id: 2, pass: 'barber_2_pass' },
    { id: 3, pass: 'client_1_pass' },
    { id: 4, pass: 'client_2_pass' },
    { id: 5, pass: 'admin_pass' },
    { id: 6, pass: 'test_user_pass' }
];

async function generateHashes() {
    console.log('ID | Contraseña Plana | Hash (Bcrypt)');
    console.log('---|-----------------|---------------');
    for (const user of users) {
        const hash = await bcrypt.hash(user.pass, 10);
        console.log(`${user.id} | ${user.pass} | ${hash}`);
    }
}

generateHashes();
