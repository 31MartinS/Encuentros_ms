import { Request, Response } from 'express';
import { createUser, updateUser, getUserByEmail, deleteUser, getUserById } from '../services/user.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { generateToken } from '../utils/jwt';
import bcrypt from 'bcrypt';
import { getChannel } from '../config/rabbitmq';

// Controlador para registrar un nuevo usuario
export async function registerUser(req: Request, res: Response) {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  try {
    await createUser({ firstname, lastname, email, password });

    // 📨 Enviar mensaje a RabbitMQ
    const channel = getChannel();
    await channel.assertQueue('notificaciones', { durable: true });
    await channel.sendToQueue(
      'notificaciones',
      Buffer.from(JSON.stringify({
        tipo: 'nuevo_registro',
        email,
        nombre: firstname,
        fecha: new Date().toISOString()
      })),
      { persistent: true }
    );

    res.status(201).json({ message: 'Usuario registrado correctamente.' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error en registro:', error);
      if ('code' in error && (error as any).code === '23505') {
        return res.status(409).json({ message: 'El correo ya está en uso.' });
      }
    } else {
      console.error('Error en registro (tipo desconocido):', error);
    }

    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

// Controlador para login de usuario
export async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;

  // Validación de campos
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
  }

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Comparación segura de contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }

    // Generación de token JWT para autenticación
    const token = generateToken(user);

    res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

import { getAllUsers } from '../services/user.service';

// Controlador para listar todos los usuarios registrados
export async function listUsers(req: Request, res: Response) {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

// Controlador para editar datos de un usuario específico
export async function editUser(req: Request, res: Response) {
  const { id } = req.params;
  const updates = req.body;
  const user = (req as AuthRequest).user; // Requiere AuthRequest con user inyectado

  // Validación: se requiere al menos un campo para actualizar
  if (!updates || Object.keys(updates).length === 0) {
    return res.status(400).json({ message: 'No se enviaron datos para actualizar.' });
  }

  // Restricción: solo un admin puede modificar el campo "role"
  if (user.role !== 'admin' && 'role' in updates) {
    return res.status(403).json({ message: 'No puedes cambiar tu rol.' });
  }

  try {
    await updateUser(id, updates);
    res.json({ message: 'Usuario actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

// Controlador para eliminar un usuario por su ID
export async function removeUser(req: Request, res: Response) {
  const { id } = req.params;

  try {
    await deleteUser(id);
    res.json({ message: 'Usuario eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

// Controlador para obtener un usuario por su ID
export async function getUser(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}
