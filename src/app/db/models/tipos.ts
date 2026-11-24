
import { sqliteService } from '../sqlite.service';
/**
 * Modelo de datos de un Tipo de atención.
 */
export interface Tipo {
  id: number;
  nombre: string;
  prefijo: string;
  secuencia_inicial: number;
  descripcion: string;
  activo: number;
}

/**
 * Datos necesarios para crear un Tipo de atención.
 */
export interface TipoCreate {
  nombre: string;
  prefijo: string;
  secuencia_inicial: number;
  descripcion: string;
}

/**
 * Datos permitidos para actualizar un Tipo de atención.
 */
export interface TipoUpdate {
  nombre?: string;
  prefijo?: string;
  descripcion?: string;
  secuencia_inicial?: number;
  activo?: number;
}

/**
 * Servicio CRUD de Tipos de atención.
 */
export class TipoService {

    protected db: any;

  constructor() {
    this.db = sqliteService;
  }
    /**
   * Obtener todas los Tipo de atención.
   */
  async getAll(columns?: string): Promise<Tipo[]> {

    await this.db.init();


    if( columns !== undefined && columns.length > 0 ){
      return await this.db.query(
        `SELECT 
          ${columns}
        FROM tipos WHERE activo = 1` // ORDER BY tipo_id DESC
      );
    }else{
      return await this.db.query(
        `SELECT 
          tipo_id AS id, 
          nombre,
          prefijo,
          secuencia_inicial,
          descripcion,
          activo 
        FROM tipos` // WHERE activo = 1 ORDER BY tipo_id DESC
      );
    }
    
  }

  /**
   * Obtener Tipo de atención activas.
   */
  async getActive(): Promise<Tipo[]> {
    await this.db.init();

    return await this.db.query( // <Tipo>
      `SELECT
        tipo_id AS id, 
        nombre,
        prefijo,
        secuencia_inicial,
        descripcion,
        activo 
      FROM tipos WHERE activo = 1 ORDER BY nombre ASC`
    );
  }

  /**
   * Obtener un Tipo de atención por ID.
   */
  async getById(id: number): Promise<Tipo | null> {
    await this.db.init();

    const result = await this.db.query(
      `SELECT
        tipo_id AS id, 
        nombre,
        prefijo,
        secuencia_inicial,
        descripcion,
        activo 
      FROM tipos WHERE tipo_id = ?`,
      [id]
    );

    return result[0] ?? null;
  }

  async getTypeFilter(ids: number[]): Promise<Tipo[]> {
    await this.db.init();

    console.log("ids", ids);

    if (ids.length === 0) return [];

    const placeholders = ids.map(() => '?').join(', ');

    const result = await this.db.query(
      `SELECT
          tipo_id AS id, 
          nombre,
          prefijo,
          secuencia_inicial,
          descripcion,
          activo 
        FROM tipos
        WHERE tipo_id IN (${placeholders})`,
      ids
    );

    console.log("result", result);

    return result;
  }

  /**
   * Obtener el siguiente ID de Tipo de atención.
   */
  async getNextId(): Promise<number> {
    await this.db.init();
    const next = await this.db.query(
      `SELECT MAX(tipo_id) + 1 AS id FROM tipos`
    );

    return next[0].id ?? 1;
  }

  /**
   * Crear un nuevo Tipo de atención.
   */
  async create(data: TipoCreate): Promise<number> {
    await this.db.init();
    const result = await this.db.run(
      `INSERT INTO tipos (
        nombre,
        prefijo,
        secuencia_inicial,
        descripcion 
      ) VALUES (?, ?, ?, ?)`,
      [
        data.nombre,
        data.prefijo,
        data.secuencia_inicial,
        data.descripcion
      ]
    );

    return result.lastId;
  }

  /**
   * Actualizar un Tipo de atención.
   */
  async update(
    id: number,
    data: TipoUpdate
  ): Promise<boolean> {

    await this.db.init();

    const fields: string[] = [];
    const values: unknown[] = [];

    if (data.nombre !== undefined) {
      fields.push('nombre = ?');
      values.push(data.nombre);
    }

    if (data.prefijo !== undefined) {
      fields.push('prefijo = ?');
      values.push(data.prefijo);
    }

    if (data.secuencia_inicial !== undefined) {
      fields.push('secuencia_inicial = ?');
      values.push(data.secuencia_inicial);
    }

    if (data.descripcion !== undefined) {
      fields.push('descripcion = ?');
      values.push(data.descripcion);
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
      `UPDATE tipos
       SET ${fields.join(', ')}
       WHERE tipo_id = ?`,
      values
    );

    return result.changes > 0;
  }

  /**
   * Eliminar un Tipo de atención.
   */
  async delete(id: number): Promise<boolean> {
    await this.db.init();

    const result = await this.db.run(
      `DELETE FROM tipos WHERE tipo_id = ?`,
      [id]
    );

    return result.changes > 0;
  }

  /**
   * Activar un Tipo de atención.
   */
  async activate(id: number): Promise<boolean> {
    return await this.update(id, { activo: 1 });
  }

  /**
   * Desactivar un Tipo de atención.
   */
  async deactivate(id: number): Promise<boolean> {
    return await this.update(id, { activo: 0 });
  }
}

/**
 * Instancia compartida del servicio.
 */
export const Model = new TipoService();
