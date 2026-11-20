
import { SqliteService } from '../sqlite.service';

/**
 * Modelo de datos de una sucursal.
 */
export interface Sucursal {
  sucursal_id: number;
  nombre: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  activo: number;
}

/**
 * Datos necesarios para crear una sucursal.
 */
export interface SucursalCreate {
  nombre: string;
  telefono: string;
  direccion: string;
  ciudad: string;
}

/**
 * Datos permitidos para actualizar una sucursal.
 */
export interface SucursalUpdate {
  nombre?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  activo?: number;
}

/**
 * Servicio CRUD de sucursales.
 */
export class SucursalModel {

    protected db: any;

  constructor() {
    this.db = new SqliteService()
  }
    /**
   * Obtener todas las sucursales.
   */
  async getAll(): Promise<Sucursal[]> {

    await this.db.init();

    return this.db.query(
      `SELECT * FROM sucursales` // ORDER BY sucursal_id DESC
    );
  }

  /**
   * Obtener sucursales activas.
   */
  async getActive(): Promise<Sucursal[]> {
    await this.db.init();

    return this.db.query( // <Sucursal>
      `SELECT * FROM sucursales WHERE activo = 1 ORDER BY nombre ASC`
    );
  }

  /**
   * Obtener una sucursal por ID.
   */
  async getById(id: number): Promise<Sucursal | null> {
    await this.db.init();

    const result = await this.db.query(
      `SELECT * FROM sucursales WHERE sucursal_id = ?`,
      [id]
    );

    return result[0] ?? null;
  }

  /**
   * Crear una nueva sucursal.
   */
  async create(data: SucursalCreate): Promise<number> {
    await this.db.init();

    const result = await this.db.run(
      `INSERT INTO sucursales (
        nombre,
        telefono,
        direccion,
        ciudad
      ) VALUES (?, ?, ?, ?)`,
      [
        data.nombre,
        data.telefono,
        data.direccion,
        data.ciudad
      ]
    );

    return result.lastId;
  }

  /**
   * Actualizar una sucursal.
   */
  async update(
    id: number,
    data: SucursalUpdate
  ): Promise<boolean> {

    await this.db.init();

    const fields: string[] = [];
    const values: unknown[] = [];

    if (data.nombre !== undefined) {
      fields.push('nombre = ?');
      values.push(data.nombre);
    }

    if (data.telefono !== undefined) {
      fields.push('telefono = ?');
      values.push(data.telefono);
    }

    if (data.direccion !== undefined) {
      fields.push('direccion = ?');
      values.push(data.direccion);
    }

    if (data.ciudad !== undefined) {
      fields.push('ciudad = ?');
      values.push(data.ciudad);
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
      `UPDATE sucursales
       SET ${fields.join(', ')}
       WHERE sucursal_id = ?`,
      values
    );

    return result.changes > 0;
  }

  /**
   * Eliminar una sucursal.
   */
  async delete(id: number): Promise<boolean> {
    await this.db.init();

    const result = await this.db.run(
      `DELETE FROM sucursales WHERE sucursal_id = ?`,
      [id]
    );

    return result.changes > 0;
  }

  /**
   * Activar una sucursal.
   */
  async activate(id: number): Promise<boolean> {
    return this.update(id, { activo: 1 });
  }

  /**
   * Desactivar una sucursal.
   */
  async deactivate(id: number): Promise<boolean> {
    return this.update(id, { activo: 0 });
  }
}

/**
 * Instancia compartida del servicio.
 */
export const SucursalService = new SucursalModel();
