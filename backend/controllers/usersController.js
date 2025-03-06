import bcrypt from 'bcryptjs';
import generateJwt  from '../middlewares/jwt.middleware.js';
import { getUserByEmail, createUser } from '../models/usersModel.js';

// Login de usuario
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Consultando usuario con email:', email);

    const user = await getUserByEmail(email);

    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(400).json({ message: 'Correo o contraseña incorrectos.' });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Correo o contraseña incorrectos.' });
    }

    const token = generateJwt(user);

    const response = {
      success: true,
      token,
      role: user.role,
    };

    console.log('Enviando respuesta:', response);
    return res.json(response);
  } catch (err) {
    console.error('Error en el login:', err);
    return res.status(500).json({ message: 'Error en el servidor.' });
  }
};


 const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Correo y contraseña son obligatorios." });
    }

    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const user = { email, password: hashedPassword };

    res.status(201).json({ message: "Usuario registrado con éxito." });
  } catch (err) {
    res.status(500).json({ message: "Error al registrar el usuario.", error: err.message });
  }
};

export { login, register };
