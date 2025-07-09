export function logInfo(message: string) {
  console.log(`[📢 Notificación] ${new Date().toISOString()} - ${message}`);
}

export function logError(message: string, error?: Error) {
  console.error(`[❌ Error] ${new Date().toISOString()} - ${message}`);
  if (error) {
    console.error(error);
  }
}