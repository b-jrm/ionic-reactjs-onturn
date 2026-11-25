
import { sqliteService } from '../sqlite.service';
/**
 * Modelo de datos de un usuario.
 */
export interface Usuario {
  id: number;
  correo_electronico: string;
  perfil_id: number;
  activo: number;
}

/**
 * Datos necesarios para crear un Usuario.
 */
export interface UsuarioCreate {
  correo_electronico: string;
  perfil_id: number;
}

/**
 * Datos permitidos para actualizar un Usuario.
 */
export interface UsuarioUpdate {
  correo_electronico?: string;
  perfil_id?: number;
  activo?: number;
}

/**
 * Servicio CRUD de Usuarios.
 */
export class UsuarioService {

    protected db: any;

  constructor() {
    this.db = sqliteService;
  }
    /**
   * Obtener todas los Usuarios.
   */
  async getAll(columns?: string): Promise<Usuario[]> {

    await this.db.init();


    if( columns !== undefined && columns.length > 0 ){
      return await this.db.query(
        `SELECT 
          ${columns}
        FROM usuarios` // ORDER BY usuario_id DESC
      );
    }else{
      return await this.db.query(
        `SELECT 
          usuario_id AS id, 
          correo_electronico,
          perfil_id,
          activo 
        FROM usuarios` // ORDER BY usuario_id DESC
      );
    }

    
  }

  /**
   * Obtener Usuarios activos.
   */
  async getActive(): Promise<Usuario[]> {
    await this.db.init();

    return await this.db.query( // <Usuario>
      `SELECT
        usuario_id AS id, 
        correo_electronico,
        perfil_id,
        activo 
      FROM usuarios WHERE activo = 1 ORDER BY correo_electronico ASC`
    );
  }

  /**
   * Obtener un Usuario por ID.
   */
  async getById(id: number): Promise<Usuario | null> {
    await this.db.init();

    const result = await this.db.query(
      `SELECT
        usuario_id AS id, 
        correo_electronico,
        perfil_id,
        activo 
      FROM usuarios WHERE usuario_id = ?`,
      [id]
    );

    return result[0] ?? null;
  }

  async getAuth(user: string, pass: string, prof: string): Promise<number> {
    await this.db.init();

    // console.log("user", user);
    // console.log("pass", pass);
    // console.log("prof", prof);
    // console.log("PASS:", JSON.stringify(pass));
    // console.log("PASS LENGTH:", pass.length);

    const result = await this.db.query(
      `SELECT
        u.usuario_id AS id
        FROM usuarios u
        INNER JOIN perfiles p ON p.perfil_id = u.perfil_id
        WHERE u.activo = 1 AND u.correo_electronico = ? AND p.nombre = ? AND u.clave = ?`, // u.correo_electronico = ? AND AND p.nombre = ? 
      [user, prof, pass]
    );

    // console.log("result.result", result[0]?.id);

    // const isAuth = result.find((r: any) => {
    //   console.log("r.clave == pass", r.clave + " == "+ pass + " => "+(r.clave == pass));
    //   if(r.clave == pass) return true;
    // });
    // console.log("result.getAuth", isAuth);
    
    return result[0]?.id || 0;
  }

  async getNextId(): Promise<number> {
    await this.db.init();
    const next = await this.db.query(
      `SELECT MAX(usuario_id) + 1 AS id FROM usuarios`
    );

    return next[0].id ?? 1;
  }

  /**
   * Crear un nuevo Usuario.
   */
  async create(data: UsuarioCreate): Promise<number> {
    await this.db.init();

    const result = await this.db.run(
      `INSERT INTO usuarios (
        correo_electronico,
        clave,
        perfil_id 
      ) VALUES (?, ?, ?)`,
      [
        data.correo_electronico,
        data.correo_electronico.split('@')[0],
        data.perfil_id
      ]
    );

    return result.lastId;
  }

  /**
   * Actualizar un Usuario.
   */
  async update(
    id: number,
    data: UsuarioUpdate
  ): Promise<boolean> {

    await this.db.init();

    const fields: string[] = [];
    const values: unknown[] = [];

    if (data.correo_electronico !== undefined) {
      fields.push('correo_electronico = ?');
      values.push(data.correo_electronico);
    }

    if (data.perfil_id !== undefined) {
      fields.push('perfil_id = ?');
      values.push(data.perfil_id);
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
      `UPDATE usuarios
       SET ${fields.join(', ')}
       WHERE usuario_id = ?`,
      values
    );

    return result.changes > 0;
  }

  /**
   * Eliminar un Usuario.
   */
  async delete(id: number): Promise<boolean> {
    await this.db.init();

    const result = await this.db.run(
      `DELETE FROM usuarios WHERE usuario_id = ?`,
      [id]
    );

    return result.changes > 0;
  }

  /**
   * Activar un Usuario.
   */
  async activate(id: number): Promise<boolean> {
    return await this.update(id, { activo: 1 });
  }

  /**
   * Desactivar un Usuario.
   */
  async deactivate(id: number): Promise<boolean> {
    return await this.update(id, { activo: 0 });
  }
}

/**
 * Instancia compartida del servicio.
 */
export const Model = new UsuarioService();
