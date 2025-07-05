import { Router } from 'express';
import {
  registerUser,
  loginUser,
  listUsers,
  editUser,
  removeUser,
  getUser
} from '../controllers/user.controller';

import {
  authenticateToken,
  authorizeRole,
  handleValidationErrors
} from '../middlewares/auth.middleware';

import {
  validateRegister,
  validateLogin,
  validateUpdate
} from '../middlewares/user.validator';

const router = Router();

/**
 * @route   POST /register
 * @desc    Registra un nuevo usuario
 * @access  Público
 */
router.post('/register', validateRegister, handleValidationErrors, registerUser);

/**
 * @route   POST /login
 * @desc    Autentica un usuario y retorna un token
 * @access  Público
 */
router.post('/login', validateLogin, handleValidationErrors, loginUser);

/**
 * @route   GET /me
 * @desc    Devuelve los datos del usuario autenticado
 * @access  Privado (cualquier usuario autenticado)
 */
router.get('/me', authenticateToken, (req, res) => {
  const user = (req as any).user;
  res.json({ message: 'Ruta protegida', user });
});

/**
 * @route   GET /users
 * @desc    Lista todos los usuarios
 * @access  Privado - Solo admin
 */
router.get('/users', authenticateToken, authorizeRole('admin'), listUsers);

/**
 * @route   PUT /users/:id
 * @desc    Actualiza información de un usuario
 * @access  Privado (el propio usuario o admin)
 */
router.put(
  '/users/:id',
  authenticateToken,
  validateUpdate,
  handleValidationErrors,
  editUser
);

/**
 * @route   DELETE /users/:id
 * @desc    Elimina un usuario por ID
 * @access  Privado - Solo admin
 */
router.delete('/users/:id', authenticateToken, authorizeRole('admin'), removeUser);

/**
 * @route   GET /users/:id
 * @desc    Obtiene un usuario por ID
 * @access  Privado - Solo admin
 */
router.get('/users/:id', authenticateToken, authorizeRole('admin'), getUser);

export default router;
