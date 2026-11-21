
import { sqliteService } from '../sqlite.service';
/**
 * Modelo de datos de un Perfil.
 */
export interface Perfil {
  id: number;
  nombre: string;
  activo: number;
}

/**
 * Datos necesarios para crear un Perfil.
 */
export interface PerfilCreate {
  nombre: string;
}

/**
 * Datos permitidos para actualizar un Perfil.
 */
export interface PerfilUpdate {
  nombre?: string;
  activo?: number;
}

/**
 * Servicio CRUD de Perfiles.
 */
export class PerfilService {

    protected db: any;

  constructor() {
    this.db = sqliteService;
  }
    /**
   * Obtener todas los Perfiles.
   */
  async getAll(columns?: string): Promise<Perfil[]> {

    await this.db.init();


    if( columns !== undefined && columns.length > 0 ){
      return await this.db.query(
        `SELECT 
          ${columns}
        FROM perfiles` // ORDER BY perfil_id DESC
      );
    }else{
      return await this.db.query(
        `SELECT 
          perfil_id AS id, 
          nombre,
          activo 
        FROM perfiles` // ORDER BY perfil_id DESC
      );
    }

    
  }

  /**
   * Obtener Perfiles activos.
   */
  async getActive(): Promise<Perfil[]> {
    await this.db.init();

    return await this.db.query( // <Perfil>
      `SELECT
        perfil_id AS id, 
        nombre,
        activo 
      FROM perfiles WHERE activo = 1 ORDER BY nombre ASC`
    );
  }

  /**
   * Obtener un Perfil por ID.
   */
  async getById(id: number): Promise<Perfil | null> {
    await this.db.init();

    const result = await this.db.query(
      `SELECT
        perfil_id AS id, 
        nombre,
        activo 
      FROM perfiles WHERE perfil_id = ?`,
      [id]
    );

    return result[0] ?? null;
  }

  async getNextId(): Promise<number> {
    await this.db.init();
    const next = await this.db.query(
      `SELECT MAX(perfil_id) + 1 AS id FROM perfiles`
    );

    return next[0].id ?? 1;
  }

  /**
   * Crear un nuevo Perfil.
   */
  async create(data: PerfilCreate): Promise<number> {
    await this.db.init();

    const result = await this.db.run(
      `INSERT INTO perfiles (
        nombre
      ) VALUES (?)`,
      [
        data.nombre
      ]
    );

    return result.lastId;
  }

  /**
   * Actualizar un Perfil.
   */
  async update(
    id: number,
    data: PerfilUpdate
  ): Promise<boolean> {

    await this.db.init();

    const fields: string[] = [];
    const values: unknown[] = [];

    if (data.nombre !== undefined) {
      fields.push('nombre = ?');
      values.push(data.nombre);
    }

    if (data.activo !== undefined) {
      fields.push('activo = ?');
      values.push(data.activo);
    }

    if (fields.length === 0) {
      return false;
    }

    values.push(id);

    const result = await this.db.run(
      `UPDATE perfiles
       SET ${fields.join(', ')}
       WHERE perfil_id = ?`,
      values
    );

    return result.changes > 0;
  }

  /**
   * Eliminar un Perfil.
   */
  async delete(id: number): Promise<boolean> {
    await this.db.init();

    const result = await this.db.run(
      `DELETE FROM perfiles WHERE perfil_id = ?`,
      [id]
    );

    return result.changes > 0;
  }

  /**
   * Activar un Perfil.
   */
  async activate(id: number): Promise<boolean> {
    return await this.update(id, { activo: 1 });
  }

  /**
   * Desactivar un Perfil.
   */
  async deactivate(id: number): Promise<boolean> {
    return await this.update(id, { activo: 0 });
  }
}

/**
 * Instancia compartida del servicio.
 */
export const Model = new PerfilService();
