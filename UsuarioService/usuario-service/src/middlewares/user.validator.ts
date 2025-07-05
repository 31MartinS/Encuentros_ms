import { body } from 'express-validator';

/**
 * Validaciones para el registro de un nuevo usuario.
 * Aplica validación de formato, presencia y longitud mínima.
 */
export const validateRegister = [
  body('firstname')
    .trim() // Elimina espacios en blanco alrededor
    .notEmpty().withMessage('El nombre es obligatorio'),

  body('lastname')
    .trim()
    .notEmpty().withMessage('El apellido es obligatorio'),

  body('email')
    .isEmail().withMessage('Correo inválido')
    .normalizeEmail(), // Normaliza el correo a formato estándar

  body('password')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];

/**
 * Validaciones para el login de usuario.
 * Requiere email válido y contraseña no vacía.
 */
export const validateLogin = [
  body('email')
    .isEmail().withMessage('Correo inválido'),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria'),
];

/**
 * Validaciones para actualizar datos del usuario.
 * Todos los campos son opcionales, pero si se envían, deben cumplir el formato esperado.
 */
export const validateUpdate = [
  body('firstname')
    .optional() // Solo se valida si el campo fue enviado
    .isString().withMessage('El nombre debe ser texto')
    .notEmpty().withMessage('El nombre no puede estar vacío'),

  body('lastname')
    .optional()
    .isString().withMessage('El apellido debe ser texto')
    .notEmpty().withMessage('El apellido no puede estar vacío'),

  body('email')
    .optional()
    .isEmail().withMessage('Correo inválido'),

  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres'),

  body('role')
    .optional()
    .isIn(['user', 'admin']).withMessage('Rol inválido. Debe ser "user" o "admin"'),
];
