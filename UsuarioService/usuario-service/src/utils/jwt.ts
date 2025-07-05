import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

// Clave secreta para firmar/verificar los tokens JWT
// Se recomienda configurar JWT_SECRET como variable de entorno segura
const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto123';

/**
 * Genera un token JWT con los datos esenciales del usuario.
 *
 * @param user - Objeto de usuario que contiene id, email y rol.
 * @returns Token JWT firmado válido por 1 hora.
 */
export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '1h' } // El token expira en 1 hora
  );
}

/**
 * Verifica y decodifica un token JWT.
 *
 * @param token - Token JWT recibido en la solicitud.
 * @returns Datos decodificados si el token es válido, o lanza un error si no lo es.
 */
export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}
