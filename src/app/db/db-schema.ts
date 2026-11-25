export const DB_NAME = 'onturn';
export const DB_VERSION = 1; // versión de la conexión (cifrado/upgrade del plugin). El esquema se versiona abajo.

export interface Migration {
  version: number;
  sql: string;
}

/**
 * Migraciones del esquema. Para cambiar la base de datos en el futuro,
 * agrega un nuevo objeto con version = anterior + 1. Nunca edites uno ya publicado.
 * La versión aplicada se guarda en PRAGMA user_version.
 */
export const MIGRATIONS: Migration[] = [
  {
    version: 1,
    sql: `
      CREATE TABLE IF NOT EXISTS tipos (
        tipo_id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL, 
        prefijo TEXT NOT NULL UNIQUE,
        secuencia_inicial INTEGER NOT NULL DEFAULT 1,
        descripcion TEXT NULL,
        activo INTEGER NOT NULL DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS dias (
        dia_id INTEGER PRIMARY KEY AUTOINCREMENT,
        dia TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS perfiles (
        perfil_id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        activo INTEGER NOT NULL DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS sucursales (
        sucursal_id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        telefono TEXT NOT NULL,
        direccion TEXT NOT NULL,
        ciudad TEXT NOT NULL,
        activo INTEGER NOT NULL DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS clientes (
        cliente_id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NULL,
        documento TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS usuarios (
        usuario_id INTEGER PRIMARY KEY AUTOINCREMENT,
        correo_electronico TEXT NOT NULL UNIQUE,
        clave TEXT NOT NULL,
        perfil_id INTEGER REFERENCES perfiles(perfil_id) ON DELETE SET NULL,
        activo INTEGER NOT NULL DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS jornadas (
        jornada_id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        hora_inicio TEXT NOT NULL,
        hora_fin TEXT NOT NULL,
        dias TEXT NOT NULL,
        tipos TEXT NOT NULL,
        sucursal_id INTEGER REFERENCES sucursales(sucursal_id) ON DELETE SET NULL,
        activo INTEGER NOT NULL DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS puestos (
        puesto_id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        numero TEXT NOT NULL,
        sucursal_id INTEGER REFERENCES sucursales(sucursal_id) ON DELETE SET NULL,
        usuario_id INTEGER REFERENCES usuarios(usuario_id) ON DELETE SET NULL,
        activo INTEGER NOT NULL DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS turnos (
        turno_id INTEGER PRIMARY KEY AUTOINCREMENT,
        secuencia INTEGER NOT NULL,
        fecha TEXT NOT NULL,
        estado INTEGER NOT NULL DEFAULT 1,
        fecha_inicio TEXT NOT NULL,
        fecha_llamado TEXT NOT NULL,
        fecha_atencion TEXT NOT NULL,
        fecha_finalizado TEXT NOT NULL,
        jornada_id INTEGER REFERENCES jornadas(jornada_id) ON DELETE SET NULL,
        puesto_id INTEGER REFERENCES puestos(puesto_id) ON DELETE SET NULL,
        cliente_id INTEGER REFERENCES clientes(cliente_id) ON DELETE SET NULL
      );

      CREATE INDEX IF NOT EXISTS idx_turnos_estado ON turnos (fecha, estado);

      INSERT OR IGNORE INTO tipos (nombre, prefijo, descripcion) VALUES
        ('Atención general',    'G', 'Consultas y trámites básicos'),
        ('Caja y pagos',        'C', 'Pagos y recaudos'),
        ('Asesoría comercial',  'A', 'Productos y planes'),
        ('Reclamos y PQRS',     'R', 'Quejas y sugerencias'),
        ('Atención prioritaria','P', 'Adultos mayores y embarazadas');

      INSERT OR IGNORE INTO perfiles (nombre) VALUES ('Administrador'), ('Operador'), ('Cliente');

      INSERT OR IGNORE INTO sucursales (nombre, telefono, direccion, ciudad) VALUES 
        ('Sede Centro', 6017283712, 'Cra 7 # 32-16', 'Bogotá'),
        ('Sede Norte', 6016281702, 'Calle 127 # 15-40', 'Bogotá'),
        ('Sede Cali', 6023100730, 'Av. 6N # 23-50', 'Cali'),
        ('Sede Medellín', 6043280720, 'Av. El Poblado # 10-25', 'Medellín');

      INSERT OR IGNORE INTO usuarios (correo_electronico, clave, perfil_id) VALUES 
        ('admin@onturn.co', 'admin', (SELECT perfil_id FROM perfiles WHERE nombre = 'Administrador' LIMIT 1)),
        ('operator1@onturn.co', 'operator1', (SELECT perfil_id FROM perfiles WHERE nombre = 'Operador' LIMIT 1)),
        ('operator2@onturn.co', 'operator2', (SELECT perfil_id FROM perfiles WHERE nombre = 'Operador' LIMIT 1));

      INSERT OR IGNORE INTO jornadas (nombre, hora_inicio, dias, tipos, sucursal_id) VALUES 
        ('Jornada Única', '08:00', '22:00', '1|2|3|4|5', '1|2|3', (SELECT sucursal_id FROM sucursales WHERE nombre = 'Sede Centro' LIMIT 1)),
        ('Jornada Única', '08:00', '22:00', '1|2|3|4|5', '1|2|3', (SELECT sucursal_id FROM sucursales WHERE nombre = Sede Norte' LIMIT 1)),
        ('Jornada Única', '08:00', '22:00', '1|2|3|4|5', '1|2|3', (SELECT sucursal_id FROM sucursales WHERE nombre = Sede Cali' LIMIT 1)),
        ('Jornada Única', '08:00', '22:00', '1|2|3|4|5', '1|2|3', (SELECT sucursal_id FROM sucursales WHERE nombre = Sede Medellín' LIMIT 1));

    `,
  },
];
