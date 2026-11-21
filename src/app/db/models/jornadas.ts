
import { sqliteService } from '../sqlite.service';
/**
 * Modelo de datos de una Jornada.
 */
export interface Jornada {
  id: number;
  nombre: string;
  hora_inicio: string;
  hora_fin: string;
  secuencia_inicial: number;
  sucursal_id: number;
  activo: number;
}

/**
 * Datos necesarios para crear una Jornada.
 */
export interface JornadaCreate {
  nombre: string;
  hora_inicio: string;
  hora_fin: string;
  secuencia_inicial: number;
  sucursal_id: number;
  activo: number;
}

/**
 * Datos permitidos para actualizar una Jornada.
 */
export interface JornadaUpdate {
  nombre?: string;
  hora_inicio?: string;
  hora_fin?: string;
  secuencia_inicial?: number;
  sucursal_id?: number;
  activo?: number;
}

/**
 * Servicio CRUD de jornadas.
 */
export class JornadaService {

    protected db: any;

  constructor() {
    this.db = sqliteService;
  }
    /**
   * Obtener todas las jornadas.
   */
  async getAll(columns?: string): Promise<Jornada[]> {

    await this.db.init();


    if( columns !== undefined && columns.length > 0 ){
      return await this.db.query(
        `SELECT 
          ${columns}
        FROM jornadas` // ORDER BY jornada_id DESC
      );
    }else{
      return await this.db.query(
        `SELECT 
          jornada_id AS id, 
          nombre,
          hora_inicio,
          hora_fin,
          secuencia_inicial,
          sucursal_id,
          activo 
        FROM jornadas` // ORDER BY jornada_id DESC
      );
    }

    
  }

  /**
   * Obtener jornadas activas.
   */
  async getActive(): Promise<Jornada[]> {
    await this.db.init();

    return await this.db.query( // <Jornada>
      `SELECT
        jornada_id AS id, 
        nombre,
        hora_inicio,
        hora_fin,
        secuencia_inicial,
        sucursal_id,
        activo 
      FROM jornadas WHERE activo = 1 ORDER BY nombre ASC`
    );
  }

  /**
   * Obtener una jornada por ID.
   */
  async getById(id: number): Promise<Jornada | null> {
    await this.db.init();

    const result = await this.db.query(
      `SELECT
        jornada_id AS id, 
        nombre,
        hora_inicio,
        hora_fin,
        secuencia_inicial,
        sucursal_id,
        activo 
      FROM jornadas WHERE puesto_id = ?`,
      [id]
    );

    return result[0] ?? null;
  }

  async getNextId(): Promise<number> {
    await this.db.init();
    const next = await this.db.query(
      `SELECT MAX(jornada_id) + 1 AS id FROM jornadas`
    );

    return next[0].id ?? 1;
  }

  /**
   * Crear una nueva jornada.
   */
  async create(data: JornadaCreate): Promise<number> {
    await this.db.init();

    const result = await this.db.run(
      `INSERT INTO jornadas (
        nombre,
        hora_inicio,
        hora_fin,
        secuencia_inicial,
        sucursal_id 
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        data.nombre,
        data.hora_inicio,
        data.hora_fin,
        data.secuencia_inicial,
        data.sucursal_id
      ]
    );

    return result.lastId;
  }

  /**
   * Actualizar una jornada.
   */
  async update(
    id: number,
    data: JornadaUpdate
  ): Promise<boolean> {

    await this.db.init();

    const fields: string[] = [];
    const values: unknown[] = [];

    if (data.nombre !== undefined) {
      fields.push('nombre = ?');
      values.push(data.nombre);
    }

    if (data.hora_inicio !== undefined) {
      fields.push('hora_inicio = ?');
      values.push(data.hora_inicio);
    }

    if (data.hora_fin !== undefined) {
      fields.push('hora_fin = ?');
      values.push(data.hora_fin);
    }

    if (data.secuencia_inicial !== undefined) {
      fields.push('secuencia_inicial = ?');
      values.push(data.secuencia_inicial);
    }

    if (data.sucursal_id !== undefined) {
      fields.push('sucursal_id = ?');
      values.push(data.sucursal_id);
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
      `UPDATE jornadas
       SET ${fields.join(', ')}
       WHERE jornada_id = ?`,
      values
    );

    return result.changes > 0;
  }

  /**
   * Eliminar una jornada.
   */
  async delete(id: number): Promise<boolean> {
    await this.db.init();

    const result = await this.db.run(
      `DELETE FROM jornadas WHERE jornada_id = ?`,
      [id]
    );

    return result.changes > 0;
  }

  /**
   * Activar una jornada.
   */
  async activate(id: number): Promise<boolean> {
    return await this.update(id, { activo: 1 });
  }

  /**
   * Desactivar una jornada.
   */
  async deactivate(id: number): Promise<boolean> {
    return await this.update(id, { activo: 0 });
  }
}

/**
 * Instancia compartida del servicio.
 */
export const Model = new JornadaService();
