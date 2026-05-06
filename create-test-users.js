const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create test users with pre-hashed passwords
// Password: admin123 -> $2a$10$...
// Password: user123 -> $2a$10$...

async function createTestUsers() {
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin123', salt);
  const userPassword = await bcrypt.hash('user123', salt);
  const employeePassword = await bcrypt.hash('employee123', salt);

  const users = [
    {
      id: 'admin_001',
      email: 'admin@superlogistica.com',
      password: adminPassword,
      name: 'Administrador',
      role: 'admin',
      verified: true,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: 'user_001',
      email: 'cliente@superlogistica.com',
      password: userPassword,
      name: 'Juan Cliente',
      role: 'user',
      verified: true,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: 'employee_001',
      email: 'empleado@superlogistica.com',
      password: employeePassword,
      name: 'Carlos Empleado',
      role: 'employee',
      verified: true,
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ];

  fs.writeFileSync(path.join(dataDir, 'users.json'), JSON.stringify(users, null, 2));
  fs.writeFileSync(path.join(dataDir, 'verification-codes.json'), JSON.stringify({}, null, 2));

  console.log('✅ Test users created successfully!');
  console.log('\n📋 Test Credentials:\n');
  console.log('ADMIN:');
  console.log('  Email: admin@superlogistica.com');
  console.log('  Password: admin123\n');
  console.log('USER:');
  console.log('  Email: cliente@superlogistica.com');
  console.log('  Password: user123\n');
  console.log('EMPLOYEE:');
  console.log('  Email: empleado@superlogistica.com');
  console.log('  Password: employee123');
}

createTestUsers().catch(console.error);
