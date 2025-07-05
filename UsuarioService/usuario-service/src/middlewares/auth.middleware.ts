import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

// Clave secreta para verificar los tokens JWT.
// Se recomienda establecer JWT_SECRET en las variables de entorno para mayor seguridad.
const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto123';

// Extensión de la interfaz Request para incluir un campo opcional 'user',
// el cual será rellenado tras la verificación del token.
export interface AuthRequest extends Request {
  user?: any;
}

// Middleware para autenticar solicitudes mediante JWT.
// Si el token es válido, añade los datos del usuario a req.user y continúa.
export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  // Verifica que se haya enviado un token en el header con el formato 'Bearer <token>'
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Guarda la información del usuario decodificada
    next();
  } catch (error) {
    // Si el token es inválido o ha expirado
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }
}

// Middleware para restringir el acceso a rutas según el rol del usuario.
// Se utiliza después de authenticateToken.
export function authorizeRole(role: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // Verifica si el usuario tiene el rol requerido
    if (req.user?.role !== role) {
      return res.status(403).json({ message: 'No tienes permisos para acceder a esta ruta.' });
    }
    next();
  };
}

// Middleware para manejar errores de validación generados por express-validator.
// Devuelve un error 400 si se detectan errores en las reglas de validación previas.
export function handleValidationErrors(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}
