
import { sqliteService } from '../sqlite.service';
/**
 * Modelo de datos de una Jornada.
 */
export interface Jornada {
  id: number;
  nombre: string;
  hora_inicio: string;
  hora_fin: string;
  sucursal_id: number;
  dias: number[];
  tipos: number[];
  activo: number;
}

export interface JornadaUnique {
  id: number;
  nombre: string;
  tipos: number[];
}

/**
 * Datos necesarios para crear una Jornada.
 */
export interface JornadaCreate {
  nombre: string;
  hora_inicio: string;
  hora_fin: string;
  sucursal_id: number;
  dias: number[];
  tipos: number[];
  activo: number;
}

/**
 * Datos permitidos para actualizar una Jornada.
 */
export interface JornadaUpdate {
  nombre?: string;
  hora_inicio?: string;
  hora_fin?: string;
  sucursal_id?: number;
  dias?: number[];
  tipos?: number[];
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

    let result: any[];

    if( columns !== undefined && columns.length > 0 ){
      const response = await this.db.query(
        `SELECT 
          ${columns}
        FROM jornadas` // ORDER BY jornada_id DESC
      );
      result = response.values ?? [];
    }else{
      const response =  await this.db.query(
        `SELECT 
          jornada_id AS id, 
          nombre,
          hora_inicio,
          hora_fin,
          sucursal_id,
          dias,
          tipos,
          activo 
        FROM jornadas` // ORDER BY jornada_id DESC
      );
      result = response.values ?? [];
    }

    result.map((r) => ({
      ...r,
      dias: r.dias ? r.dias.split("|").map(Number) : [],
      tipos: r.tipos ? r.tipos.split("|").map(Number) : []
    }));

    console.log("result", result);

    return result;

    
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
        sucursal_id,
        dias,
        tipos,
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
        sucursal_id,
        dias,
        tipos,
        activo 
      FROM jornadas WHERE puesto_id = ?`,
      [id]
    );

    return result[0] ?? null;
  }

  /**
   * Obtener una jornada por ID de sucursal.
   */
  async getBySucursal(id: number): Promise<Jornada[]> {
    await this.db.init();

    const result = await this.db.query(
      `SELECT 
        jornada_id AS id, 
        nombre,
        hora_inicio,
        hora_fin,
        sucursal_id,
        dias,
        tipos,
        activo
      FROM jornadas WHERE sucursal_id = ?`,
      [id]
    );

    // console.log("result0", result);

    result.map((r: Jornada) => {
      
      // console.log("r",r);
      
      if(typeof r.dias === 'string') r.dias = String(r.dias).split("|").map(Number);
      if(typeof r.tipos === 'string') r.tipos = String(r.tipos).split("|").map(Number);

      return {
        ...r,
        dias: r.dias,
        tipos: r.tipos
      }
    });

    // console.log("result1", result);

    return result;
  }

  /**
   * Obtener una jornada unica activa por ID de sucursal, que este dentro dentro del horario de consulta.
   */
  async getActiveUniqueBySucursal(id: number): Promise<JornadaUnique | null> {
    await this.db.init();

    const result = await this.db.query(
      `WITH momento AS (
        SELECT
          time('now', 'localtime') AS hora_actual,
          (CAST(strftime('%w', 'now', 'localtime') AS INTEGER) + 6) % 7 AS dia_actual
      )
      SELECT 
          j.jornada_id AS id,
          j.nombre,
          j.tipos
      FROM jornadas j
      CROSS JOIN momento m
      WHERE j.sucursal_id = ?
        AND j.activo = 1

        -- Validar día de inicio de la jornada
        AND (
          '|' || j.dias || '|'
          LIKE '%|' ||
          CASE
            WHEN time(j.hora_inicio) > time(j.hora_fin)
              AND m.hora_actual <= time(j.hora_fin)
            THEN (m.dia_actual + 6) % 7
            ELSE m.dia_actual
          END
          || '|%'
        )

        -- Validar horario
        AND (
          (
            time(j.hora_inicio) <= time(j.hora_fin)
            AND m.hora_actual BETWEEN time(j.hora_inicio) AND time(j.hora_fin)
          )
          OR
          (
            time(j.hora_inicio) > time(j.hora_fin)
            AND (
              m.hora_actual >= time(j.hora_inicio)
              OR m.hora_actual <= time(j.hora_fin)
            )
          )
        )
      LIMIT 1`,
      [id]
    );

    // console.log("result.jornada_disponible", result);

    result.map((r: JornadaUnique) => {
      
      // console.log("r",r);
      
      if(typeof r.tipos === 'string') r.tipos = String(r.tipos).split("|").map(Number);

      return {
        ...r,
        tipos: r.tipos
      }
    });

    // console.log("result1", result);

    return result.length > 0 ? result[0] : null;
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
    console.log("create.data", data);
    const result = await this.db.run(
      `INSERT INTO jornadas (
        nombre,
        hora_inicio,
        hora_fin,
        sucursal_id,
        dias,
        tipos
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.nombre,
        data.hora_inicio,
        data.hora_fin,
        data.sucursal_id,
        data.dias.join('|'),
        data.tipos.join('|')
      ]
    );
    console.log("result", result);
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

    if (data.sucursal_id !== undefined) {
      fields.push('sucursal_id = ?');
      values.push(data.sucursal_id);
    }

    if (data.dias !== undefined) {
      fields.push('dias = ?');
      values.push(data.dias);
    }

    if (data.tipos !== undefined) {
      fields.push('tipos = ?');
      values.push(data.tipos);
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
