import bcrypt from 'bcryptjs';
import { generateJwt } from './authUtils.js';
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

// Registro de usuario
const register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    console.log('Verificando existencia de usuario con email:', email);

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      console.log('Usuario ya existe con este correo.');
      return res.status(400).json({ message: 'El correo ya está registrado.' });
    }

    // Hashear contraseña
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    console.log('Creando nuevo usuario...');
    const newUser = await createUser(email, passwordHash, role);

    if (!newUser) {
      console.log('Error al crear usuario.');
      return res.status(500).json({ message: 'Error al registrar el usuario.' });
    }

    const response = {
      success: true,
      message: 'Usuario registrado exitosamente.',
      userId: newUser.id,
    };

    console.log('Usuario creado:', response);
    return res.status(201).json(response);
  } catch (err) {
    console.error('Error en el registro:', err);
    return res.status(500).json({ message: 'Error en el servidor.' });
  }
};

export { login, register };
