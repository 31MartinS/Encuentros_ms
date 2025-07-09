export function validarEvento(data: any): { valido: boolean; errores: string[] } {
  const errores: string[] = [];

  if (!data.nombre || typeof data.nombre !== 'string') errores.push('El nombre es obligatorio.');
  if (!data.descripcion || typeof data.descripcion !== 'string') errores.push('La descripción es obligatoria.');
  if (!data.fecha || isNaN(Date.parse(data.fecha))) errores.push('La fecha es inválida.');
  if (!data.zona_id || typeof data.zona_id !== 'number') errores.push('El zona_id debe ser un número.');

  return {
    valido: errores.length === 0,
    errores
  };
}
