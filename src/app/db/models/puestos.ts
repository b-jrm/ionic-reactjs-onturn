
import { sqliteService } from '../sqlite.service';
/**
 * Modelo de datos de un puesto.
 */
export interface Puesto {
  id: number;
  nombre: string;
  numero: number | string;
  sucursal_id: number;
  usuario_id: number;
  activo: number;
}

/**
 * Datos necesarios para crear un puesto.
 */
export interface PuestoCreate {
  nombre: string;
  numero: number | string;
  sucursal_id: number;
  usuario_id: number;
}

/**
 * Datos permitidos para actualizar una puesto.
 */
export interface PuestoUpdate {
  nombre?: string;
  numero?: number | string;
  sucursal_id?: number;
  usuario_id?: number;
  activo?: number;
}

/**
 * Servicio CRUD de puestos.
 */
export class PuestoService {

    protected db: any;

  constructor() {
    this.db = sqliteService;
  }
    /**
   * Obtener todas los puestos.
   */
  async getAll(): Promise<Puesto[]> {

    await this.db.init();

    return await this.db.query(
      `SELECT 
        p.puesto_id AS id, 
        p.nombre,
        p.numero,
        p.sucursal_id,
        s.nombre || ' (' || s.ciudad || ')' AS sucursal,
        p.usuario_id,
        u.correo_electronico AS usuario,
        p.activo
      FROM puestos p 
        JOIN sucursales s ON s.sucursal_id = p.sucursal_id AND s.activo = 1
        JOIN usuarios u ON u.usuario_id = p.usuario_id AND u.activo = 1
      ` // ORDER BY puesto_id DESC
        
    );
  }

  /**
   * Obtener puestos activos.
   */
  async getActive(): Promise<Puesto[]> {
    await this.db.init();

    return await this.db.query( // <Puesto>
      `SELECT
        puesto_id AS id, 
        nombre,
        numero,
        sucursal_id,
        usuario_id,
        activo
      FROM puestos WHERE activo = 1 ORDER BY nombre ASC`
    );
  }

  /**
   * Obtener un puesto por ID.
   */
  async getById(id: number): Promise<Puesto | null> {
    await this.db.init();

    const result = await this.db.query(
      `SELECT
        puesto_id AS id, 
        nombre,
        numero,
        sucursal_id,
        usuario_id,
        activo
      FROM puestos WHERE puesto_id = ?`,
      [id]
    );

    return result[0] ?? null;
  }

  async getNextId(): Promise<number> {
    await this.db.init();
    const next = await this.db.query(
      `SELECT MAX(puesto_id) + 1 AS id FROM puestos`
    );

    return next[0].id ?? 1;
  }

  /**
   * Crear un nuevo puesto.
   */
  async create(data: PuestoCreate): Promise<number> {
    await this.db.init();

    const result = await this.db.run(
      `INSERT INTO puestos (
        nombre,
        numero,
        sucursal_id,
        usuario_id
      ) VALUES (?, ?, ?, ?)`,
      [
        data.nombre,
        data.numero,
        data.sucursal_id,
        data.usuario_id
      ]
    );

    return result.lastId;
  }

  /**
   * Actualizar un puesto.
   */
  async update(
    id: number,
    data: PuestoUpdate
  ): Promise<boolean> {

    await this.db.init();

    const fields: string[] = [];
    const values: unknown[] = [];

    if (data.nombre !== undefined) {
      fields.push('nombre = ?');
      values.push(data.nombre);
    }

    if (data.numero !== undefined) {
      fields.push('numero = ?');
      values.push(data.numero);
    }

    if (data.sucursal_id !== undefined) {
      fields.push('sucursal_id = ?');
      values.push(data.sucursal_id);
    }

    if (data.usuario_id !== undefined) {
      fields.push('usuario_id = ?');
      values.push(data.usuario_id);
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
      `UPDATE puestos
       SET ${fields.join(', ')}
       WHERE puesto_id = ?`,
      values
    );

    return result.changes > 0;
  }

  /**
   * Eliminar un puesto.
   */
  async delete(id: number): Promise<boolean> {
    await this.db.init();

    const result = await this.db.run(
      `DELETE FROM puestos WHERE puesto_id = ?`,
      [id]
    );

    return result.changes > 0;
  }

  /**
   * Activar un puesto.
   */
  async activate(id: number): Promise<boolean> {
    return await this.update(id, { activo: 1 });
  }

  /**
   * Desactivar un puesto.
   */
  async deactivate(id: number): Promise<boolean> {
    return await this.update(id, { activo: 0 });
  }
}

/**
 * Instancia compartida del servicio.
 */
export const Model = new PuestoService();
