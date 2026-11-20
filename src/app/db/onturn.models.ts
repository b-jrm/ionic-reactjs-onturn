export type EstadoTurno =
  | 'en_espera'
  | 'llamando'
  | 'en_atencion'
  | 'en_pausa'
  | 'finalizado'
  | 'cancelado';

export interface TipoAtencion {
  id: number;
  nombre: string;
  prefijo: string;
  descripcion: string | null;
  prioridad: number; // 0 normal, 1 alta
  tiempo_estimado_min: number;
  visible: number; // 1 / 0
}

export interface Turno {
  id: number;
  codigo: string;
  tipo_id: number;
  consecutivo: number;
  fecha: string;
  estado: EstadoTurno;
  celular: string | null;
  puesto_id: number | null;
  creado_en: string;
  llamado_en: string | null;
  iniciado_en: string | null;
  finalizado_en: string | null;
}

export interface TurnoConTipo extends Turno {
  tipo_nombre: string;
  prefijo: string;
}
