
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import type { SQLiteDBConnection, capSQLiteSet } from '@capacitor-community/sqlite';

import {
  DB_NAME,
  DB_VERSION,
  MIGRATIONS,
} from './db-schema';

class SqliteService {

  private sqlite: SQLiteConnection;

  private db?: SQLiteDBConnection;

  private starting?: Promise<void>;

  readonly platform = Capacitor.getPlatform();

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  /**
   * Inicializa SQLite.
   * Es seguro llamar varias veces.
   */
  init(): Promise<void> {
    return (this.starting ??= this.setup());
  }

  /**
   * Configuración inicial de SQLite.
   */
  private async setup(): Promise<void> {
    try {
      if (this.platform === 'web') {
        await customElements.whenDefined('jeep-sqlite');
        await this.sqlite.initWebStore();
      }

      await this.sqlite.checkConnectionsConsistency();

      const connection = await this.sqlite.isConnection(DB_NAME, false);

      if (connection.result) {
        this.db = await this.sqlite.retrieveConnection(DB_NAME, false);
      } else {
        this.db = await this.sqlite.createConnection(
          DB_NAME,
          false,
          'no-encryption',
          DB_VERSION,
          false
        );
      }

      // Comprobar si la conexión está abierta.
      const isOpen = await this.db.isDBOpen();

      if (!isOpen.result) {
        await this.db.open();
      }

      // console.log('Conexión SQLite abierta:', DB_NAME);

      // Ejecutar operaciones solamente después de abrir la conexión.
      await this.db.execute('PRAGMA foreign_keys = ON;');

      await this.migrate();

      // console.log('SQLite inicializado correctamente');

    } catch (error) {
      this.starting = undefined;
      console.error('Error configurando SQLite:', error);
      throw error;
    }
  }

  /**
   * Ejecuta las migraciones pendientes.
   */
  private async migrate(): Promise<void> {

    const res = await this.conn.query('PRAGMA user_version;');

    const current: number =
      res.values?.[0]?.user_version ?? 0;

    for (const migration of MIGRATIONS.filter(
      (item) => item.version > current
    )) {

      await this.conn.execute(migration.sql);

      await this.conn.execute(
        `PRAGMA user_version = ${migration.version};`
      );
    }

    await this.persistWeb();
  }

  /**
   * Obtiene la conexión activa.
   */
  private get conn(): SQLiteDBConnection {

    if (!this.db) {
      throw new Error(
        'SQLite no está inicializado. Llama a init() primero.'
      );
    }

    return this.db;
  }

  /**
   * Consultas SELECT.
   */
  async query<T = any>(
    sql: string,
    params: any[] = []
  ): Promise<T[]> {

    await this.init();

    const res = await this.conn.query(sql, params);

    return (res.values ?? []) as T[];
  }

  /**
   * INSERT / UPDATE / DELETE.
   */
  async run(
    sql: string,
    params: any[] = []
  ): Promise<{ changes: number; lastId: number }> {

    await this.init();

    const res = await this.conn.run(sql, params);

    await this.persistWeb();

    return {
      changes: res.changes?.changes ?? 0,
      lastId: res.changes?.lastId ?? 0,
    };
  }

  /**
   * Ejecuta varias sentencias.
   */
  async transaction(set: capSQLiteSet[]): Promise<void> {

    await this.init();

    await this.conn.executeSet(set, true);

    await this.persistWeb();
  }

  /**
   * Cierra la conexión.
   */
  async close(): Promise<void> {

    if (!this.db) return;

    await this.sqlite.closeConnection(DB_NAME, false);

    this.db = undefined;

    this.starting = undefined;
  }

  /**
   * Persiste los cambios en SQLite Web.
   */
  private async persistWeb(): Promise<void> {
    if (this.platform === 'web') {
      await this.sqlite.saveToStore(DB_NAME);
    }
  }

  async deleteDatabase(): Promise<void> {
    try {
      await this.init();

      // await this.sqlite.closeConnection(DB_NAME, false);
      
      await CapacitorSQLite.deleteDatabase({
        database: DB_NAME,
        readonly: false
      });

      this.db = undefined;
      this.starting = undefined;

      console.log('Base de datos eliminada:', DB_NAME);
    } catch (error) {
      console.error('Error eliminando base de datos:', error);
      throw error;
    }
  }

  async resetDatabase(): Promise<void> {
    await this.deleteDatabase();
    await this.init();

    console.log('Base de datos recreada correctamente');
  }

}

export const sqliteService = new SqliteService();