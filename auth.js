const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail, sendWelcomeEmail } = require('./email');

const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const VERIFICATION_CODES_FILE = path.join(__dirname, 'data', 'verification-codes.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize files if they don't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(VERIFICATION_CODES_FILE)) {
  fs.writeFileSync(VERIFICATION_CODES_FILE, JSON.stringify({}, null, 2));
}

function getUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function getVerificationCodes() {
  return JSON.parse(fs.readFileSync(VERIFICATION_CODES_FILE, 'utf8'));
}

function saveVerificationCodes(codes) {
  fs.writeFileSync(VERIFICATION_CODES_FILE, JSON.stringify(codes, null, 2));
}

function generateVerificationCode() {
  return Math.random().toString().substring(2, 8);
}

async function registerUser(email, password, name, role = 'user') {
  try {
    const users = getUsers();
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'El correo ya está registrado' };
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const codes = getVerificationCodes();
    codes[email] = {
      code: verificationCode,
      createdAt: Date.now(),
      expiresAt: Date.now() + (30 * 60 * 1000) // 30 minutes
    };
    saveVerificationCodes(codes);

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    return {
      success: true,
      message: 'Se envió un código de verificación a tu correo',
      verificationSent: true
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'Error en el registro' };
  }
}

async function verifyEmail(email, code) {
  try {
    const codes = getVerificationCodes();
    const verificationData = codes[email];

    if (!verificationData) {
      return { success: false, message: 'Código no encontrado' };
    }

    if (verificationData.expiresAt < Date.now()) {
      delete codes[email];
      saveVerificationCodes(codes);
      return { success: false, message: 'El código ha expirado' };
    }

    if (verificationData.code !== code.toString()) {
      return { success: false, message: 'Código inválido' };
    }

    // Code verified successfully
    delete codes[email];
    saveVerificationCodes(codes);
    return { success: true, message: 'Correo verificado exitosamente' };
  } catch (error) {
    console.error('Verification error:', error);
    return { success: false, message: 'Error en la verificación' };
  }
}

async function completeRegistration(email, password, name, role = 'user') {
  try {
    const users = getUsers();

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return { success: false, message: 'El usuario ya existe' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      name,
      role,
      verified: true,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    users.push(newUser);
    saveUsers(users);

    // Send welcome email
    await sendWelcomeEmail(email, name);

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'super_logis_ctg_secret_key_2026',
      { expiresIn: '7d' }
    );

    return {
      success: true,
      message: 'Cuenta creada exitosamente',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    };
  } catch (error) {
    console.error('Registration completion error:', error);
    return { success: false, message: 'Error completando el registro' };
  }
}

async function loginUser(email, password) {
  try {
    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return { success: false, message: 'Correo o contraseña inválidos' };
    }

    if (!user.verified) {
      return { success: false, message: 'Tu correo no ha sido verificado aún' };
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return { success: false, message: 'Correo o contraseña inválidos' };
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'super_logis_ctg_secret_key_2026',
      { expiresIn: '7d' }
    );

    return {
      success: true,
      message: 'Sesión iniciada exitosamente',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Error en el login' };
  }
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'super_logis_ctg_secret_key_2026');
  } catch (error) {
    return null;
  }
}

module.exports = {
  registerUser,
  verifyEmail,
  completeRegistration,
  loginUser,
  verifyToken,
  getUsers
};
