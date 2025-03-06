import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Cargar las variables de entorno

const generateJwt = (userId) => {
  const secretKey = process.env.JWT_SECRET; // Obtener la clave secreta desde las variables de entorno
  if (!secretKey) {
    throw new Error('JWT_SECRET no está definida');
  }
  return jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
};

export default generateJwt;
