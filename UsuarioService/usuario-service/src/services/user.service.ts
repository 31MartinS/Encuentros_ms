import { pool } from '../config/db';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';

/**
 * Crea un nuevo usuario en la base de datos.
 * La contraseña se encripta antes de ser almacenada.
 * 
 * @param user - Objeto con los datos del nuevo usuario.
 */
export async function createUser(user: User): Promise<void> {
  const hashedPassword = await bcrypt.hash(user.password, 10);

  const query = `
    INSERT INTO usuarios (firstname, lastname, email, password)
    VALUES ($1, $2, $3, $4)
  `;

  await pool.query(query, [
    user.firstname,
    user.lastname,
    user.email,
    hashedPassword
  ]);
}

/**
 * Busca un usuario por su correo electrónico.
 * 
 * @param email - Correo del usuario a buscar.
 * @returns El usuario encontrado o null si no existe.
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  return result.rows[0] || null;
}

/**
 * Obtiene todos los usuarios registrados.
 * 
 * @returns Lista de usuarios (sin contraseñas).
 */
export async function getAllUsers(): Promise<User[]> {
  const result = await pool.query('SELECT id, firstname, lastname, email, role, created_at FROM usuarios');
  return result.rows;
}

/**
 * Actualiza campos específicos de un usuario.
 * Construye dinámicamente la consulta en base a los campos enviados.
 * 
 * @param id - ID del usuario a actualizar.
 * @param user - Objeto parcial con los campos a modificar.
 */
export async function updateUser(id: string, user: Partial<User>): Promise<void> {
  const fields = [];
  const values = [];
  let index = 1;

  // Construye los campos dinámicamente con valores parametrizados
  for (const key in user) {
    fields.push(`${key} = $${index}`);
    values.push((user as any)[key]);
    index++;
  }

  values.push(id);
  const query = `UPDATE usuarios SET ${fields.join(', ')} WHERE id = $${index}`;

  await pool.query(query, values);
}

/**
 * Elimina un usuario por su ID.
 * 
 * @param id - ID del usuario a eliminar.
 */
export async function deleteUser(id: string): Promise<void> {
  await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
}

/**
 * Busca un usuario por su ID.
 * 
 * @param id - ID del usuario a buscar.
 * @returns El usuario encontrado o null si no existe.
 */
export async function getUserById(id: string): Promise<User | null> {
  const result = await pool.query(
    'SELECT id, firstname, lastname, email, role, created_at FROM usuarios WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}
