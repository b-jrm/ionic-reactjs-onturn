
import { SqliteService } from '../app/db/sqlite.service';

export async function testSQLite(): Promise<boolean> {
  try {
    // 1. Inicializar la conexión

    const db = new SqliteService();

    await db.init();

    console.log('Conexión SQLite: OK');

    // 2. Consultar las tablas existentes
    const tables = await db.query<{ name: string }>(
      `SELECT name
       FROM sqlite_master
       WHERE type = 'table'
       ORDER BY name`
    );

    console.log('Tablas creadas:', tables);

    // 3. Consultar sucursales
    const sucursales = await db.query(
      'SELECT * FROM sucursales'
    );

    console.log('Sucursales:', sucursales);

    // 4. Consultar usuarios
    const usuarios = await db.query(
      `SELECT usuario_id, correo_electronico, perfil_id
       FROM usuarios`
    );

    console.log('Usuarios:', usuarios);

    return true;

  } catch (error) {
    console.error('Error en la prueba SQLite:', error);
    return false;
  }
}
