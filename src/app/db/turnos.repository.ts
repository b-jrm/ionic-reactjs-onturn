import { Injectable } from '@angular/core';
import { SqliteService } from './sqlite.service';
import { EstadoTurno, TipoAtencion, TurnoConTipo } from './onturn.models';

const SELECT_TURNO = `
  SELECT t.*, ta.nombre AS tipo_nombre, ta.prefijo AS prefijo
  FROM turnos t JOIN tipos_atencion ta ON ta.id = t.tipo_id`;

function hoyLocal(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

@Injectable({ providedIn: 'root' })
export class TurnosRepository {
  constructor(private db: SqliteService) {}

  // ---------- Cliente ----------

  /** Tipos de atención que se muestran al cliente. */
  listarTiposVisibles(): Promise<TipoAtencion[]> {
    return this.db.query<TipoAtencion>(
      'SELECT * FROM tipos_atencion WHERE visible = 1 ORDER BY prioridad DESC, nombre'
    );
  }

  /** Genera el turno (ej. G-042). El consecutivo se reinicia cada día por tipo. */
  async crearTurno(tipoId: number, celular?: string): Promise<TurnoConTipo> {
    const [tipo] = await this.db.query<TipoAtencion>(
      'SELECT * FROM tipos_atencion WHERE id = ?',
      [tipoId]
    );
    if (!tipo) throw new Error('Tipo de atención no existe');

    const fecha = hoyLocal();
    const [{ ultimo }] = await this.db.query<{ ultimo: number }>(
      'SELECT COALESCE(MAX(consecutivo), 0) AS ultimo FROM turnos WHERE tipo_id = ? AND fecha = ?',
      [tipoId, fecha]
    );
    const consecutivo = ultimo + 1;
    const codigo = `${tipo.prefijo}-${String(consecutivo).padStart(3, '0')}`;

    const { lastId } = await this.db.run(
      `INSERT INTO turnos (codigo, tipo_id, consecutivo, fecha, celular, creado_en)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [codigo, tipoId, consecutivo, fecha, celular ?? null, new Date().toISOString()]
    );
    return (await this.obtener(lastId))!;
  }

  async obtener(id: number): Promise<TurnoConTipo | undefined> {
    const rows = await this.db.query<TurnoConTipo>(`${SELECT_TURNO} WHERE t.id = ?`, [id]);
    return rows[0];
  }

  /** Cuántos turnos hay antes del tuyo en la misma cola. */
  async posicionEnCola(turnoId: number): Promise<number> {
    const [r] = await this.db.query<{ n: number }>(
      `SELECT COUNT(*) AS n FROM turnos x
       JOIN turnos t ON t.id = ?
       WHERE x.fecha = t.fecha AND x.tipo_id = t.tipo_id
         AND x.estado = 'en_espera' AND x.id < t.id`,
      [turnoId]
    );
    return r?.n ?? 0;
  }

  // ---------- Operador ----------

  /** Turnos en espera que este puesto puede atender (prioritarios primero). */
  listarEnEsperaParaPuesto(puestoId: number): Promise<TurnoConTipo[]> {
    return this.db.query<TurnoConTipo>(
      `${SELECT_TURNO}
       WHERE t.fecha = ? AND t.estado = 'en_espera'
         AND t.tipo_id IN (SELECT tipo_id FROM puesto_tipos WHERE puesto_id = ?)
       ORDER BY ta.prioridad DESC, t.id ASC`,
      [hoyLocal(), puestoId]
    );
  }

  /** "Llamar siguiente": toma el primer turno de la cola y lo asigna al puesto. */
  async llamarSiguiente(puestoId: number): Promise<TurnoConTipo | undefined> {
    const [siguiente] = await this.listarEnEsperaParaPuesto(puestoId);
    if (!siguiente) return undefined;
    await this.db.run(
      `UPDATE turnos SET estado = 'llamando', puesto_id = ?, llamado_en = ? WHERE id = ?`,
      [puestoId, new Date().toISOString(), siguiente.id]
    );
    return this.obtener(siguiente.id);
  }

  iniciarAtencion(id: number) {
    return this.cambiarEstado(id, 'en_atencion', 'iniciado_en');
  }
  pausar(id: number) {
    return this.cambiarEstado(id, 'en_pausa');
  }
  reanudar(id: number) {
    return this.cambiarEstado(id, 'en_atencion');
  }
  finalizar(id: number) {
    return this.cambiarEstado(id, 'finalizado', 'finalizado_en');
  }
  cancelar(id: number) {
    return this.cambiarEstado(id, 'cancelado', 'finalizado_en');
  }

  private async cambiarEstado(id: number, estado: EstadoTurno, columnaFecha?: string) {
    const sql = columnaFecha
      ? `UPDATE turnos SET estado = ?, ${columnaFecha} = ? WHERE id = ?`
      : 'UPDATE turnos SET estado = ? WHERE id = ?';
    const params = columnaFecha ? [estado, new Date().toISOString(), id] : [estado, id];
    await this.db.run(sql, params);
    return this.obtener(id);
  }

  // ---------- Administrador / monitoreo ----------

  /** Conteo por estado del día, para el tablero de monitoreo. */
  resumenDelDia(): Promise<{ estado: EstadoTurno; total: number }[]> {
    return this.db.query(
      'SELECT estado, COUNT(*) AS total FROM turnos WHERE fecha = ? GROUP BY estado',
      [hoyLocal()]
    );
  }

  /** Cola por tipo de atención (barras del monitoreo). */
  colaPorTipo(): Promise<{ nombre: string; prefijo: string; en_espera: number }[]> {
    return this.db.query(
      `SELECT ta.nombre, ta.prefijo,
              SUM(CASE WHEN t.estado = 'en_espera' THEN 1 ELSE 0 END) AS en_espera
       FROM tipos_atencion ta
       LEFT JOIN turnos t ON t.tipo_id = ta.id AND t.fecha = ?
       GROUP BY ta.id ORDER BY en_espera DESC`,
      [hoyLocal()]
    );
  }

  /** Tiempo promedio de atención (minutos) de turnos finalizados hoy. */
  async tiempoPromedioAtencionMin(): Promise<number> {
    const [r] = await this.db.query<{ prom: number | null }>(
      `SELECT AVG((julianday(finalizado_en) - julianday(iniciado_en)) * 1440) AS prom
       FROM turnos WHERE fecha = ? AND estado = 'finalizado' AND iniciado_en IS NOT NULL`,
      [hoyLocal()]
    );
    return Math.round((r?.prom ?? 0) * 10) / 10;
  }
}
