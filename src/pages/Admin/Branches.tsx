// src/pages/admin/Sucursales.tsx
// CRUD de sucursales (Ionic 7.2.1 + React Router v5)
import { IonAlert, IonButton, IonContent, IonInput, IonPage, IonToggle } from '@ionic/react';
import { useMemo, useState } from 'react';

import { SucursalService } from '../../app/db/models/sucursales';
import SideLayout from '../../components/SideLayout';
import { inputValue } from '../../utils/ionValue';
import { testSQLite } from '../SQLiteTest';

import { adminNav } from './nav';

interface Sucursal {
  sucursal_id: number;
  codigo: string,
  nombre: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  activo: boolean;
}

type FormSucursal = Omit<Sucursal, 'sucursal_id'>;

const VACIA: FormSucursal = {
  codigo: '',
  nombre: '',
  ciudad: '',
  direccion: '',
  telefono: '',
  activo: true,
};

const INICIALES: Sucursal[] = await SucursalService.getAll();

// TODO: reemplazar por datos reales (API)
// const INICIALES: Sucursal[] = [
//   { id: 1, codigo: 'SUC-001', nombre: 'Sede Centro', ciudad: 'Bogotá', direccion: 'Cra 7 # 32-16', telefono: '601 555 0101', activa: true },
//   { id: 2, codigo: 'SUC-002', nombre: 'Sede Norte', ciudad: 'Bogotá', direccion: 'Calle 127 # 15-40', telefono: '601 555 0102', activa: true },
//   { id: 3, codigo: 'SUC-003', nombre: 'Sede Medellín', ciudad: 'Medellín', direccion: 'Av. El Poblado # 10-25', telefono: '604 555 0103', activa: true },
//   { id: 4, codigo: 'SUC-004', nombre: 'Sede Cali', ciudad: 'Cali', direccion: 'Av. 6N # 23-50', telefono: '602 555 0104', activa: false },
// ];

const Sucursales: React.FC = () => {

  testSQLite();

  const [sucursales, setSucursales] = useState<Sucursal[]>(INICIALES);
  const [busqueda, setBusqueda] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null); // null = modo crear
  const [form, setForm] = useState<FormSucursal>(VACIA);
  const [error, setError] = useState('');
  const [aEliminar, setAEliminar] = useState<Sucursal | null>(null);

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return sucursales;
    return sucursales.filter((s) =>
      [s.codigo, s.nombre, s.ciudad, s.direccion].some((campo) => campo.toLowerCase().includes(q))
    );
  }, [sucursales, busqueda]);

  const setCampo = <K extends keyof FormSucursal>(campo: K, valor: FormSucursal[K]) =>
    setForm((f) => ({ ...f, [campo]: valor }));

  /* ---------- Crear ---------- */
  const nueva = () => {
    setEditandoId(null);
    setForm({ ...VACIA, codigo: `SUC-${String(sucursales.length + 1).padStart(3, '0')}` });
    setError('');
  };

  /* ---------- Editar (cargar en el formulario) ---------- */
  const editar = (s: Sucursal) => {
    const { id, ...resto } = s;
    setEditandoId(id);
    setForm(resto);
    setError('');
  };

  /* ---------- Guardar (crear o actualizar) ---------- */
  const guardar = () => {
    if (!form.nombre.trim() || !form.ciudad.trim() || !form.codigo.trim()) {
      setError('Código, nombre y ciudad son obligatorios.');
      return;
    }
    const codigoRepetido = sucursales.some(
      (s) => s.codigo.toLowerCase() === form.codigo.trim().toLowerCase() && s.id !== editandoId
    );
    if (codigoRepetido) {
      setError('Ya existe una sucursal con ese código.');
      return;
    }

    const limpia: FormSucursal = {
      ...form,
      codigo: form.codigo.trim(),
      nombre: form.nombre.trim(),
      ciudad: form.ciudad.trim(),
      direccion: form.direccion.trim(),
      telefono: form.telefono.trim(),
    };

    if (editandoId === null) {
      setSucursales((prev) => [...prev, { id: Date.now(), ...limpia }]);
    } else {
      setSucursales((prev) => prev.map((s) => (s.id === editandoId ? { id: s.id, ...limpia } : s)));
    }
    setEditandoId(null);
    setForm(VACIA);
    setError('');
  };

  const cancelar = () => {
    setEditandoId(null);
    setForm(VACIA);
    setError('');
  };

  /* ---------- Activar / desactivar ---------- */
  const toggleActivo = (id: number, activo: boolean) =>
    setSucursales((prev) => prev.map((s) => (s.id === id ? { ...s, activo } : s)));

  /* ---------- Eliminar ---------- */
  const confirmarEliminar = () => {
    if (!aEliminar) return;
    setSucursales((prev) => prev.filter((s) => s.id !== aEliminar.id));
    if (editandoId === aEliminar.id) cancelar();
    setAEliminar(null);
  };

  const modoEditar = editandoId !== null;

  return (
    <IonPage>
      <IonContent className="on-content">
        <SideLayout
          items={adminNav}
          activePath="/admin/sucursales"
          user={{ name: 'Carlos Ruiz', role: 'Administrador' }}
        >
          <div className="on-main">
            <div className="on-main__head">
              <div>
                <h1 className="on-h1">Sucursales</h1>
                <p className="on-sub">Administra las sedes donde se gestionan turnos.</p>
              </div>
              <IonButton className="on-btn on-btn--primary" onClick={nueva}>
                Nueva sucursal
              </IonButton>
            </div>

            <div className="on-split">
              {/* ---------- Listado ---------- */}
              <div className="on-card">
                <div className="on-toolbar">
                  <h2 style={{ margin: 0 }}>Listado</h2>
                  <IonInput
                    className="on-input on-toolbar__search"
                    placeholder="Buscar por código, nombre o ciudad"
                    value={busqueda}
                    onIonInput={(e) => setBusqueda(inputValue(e))}
                  />
                </div>

                <div className="on-table-wrap">
                  <table className="on-table">
                    <thead>
                      <tr>
                        <th>CÓDIGO</th>
                        <th>NOMBRE</th>
                        <th>CIUDAD</th>
                        <th>ESTADO</th>
                        <th style={{ textAlign: 'right' }}>ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtradas.map((s) => (
                        <tr key={s.id} className={editandoId === s.id ? 'is-selected' : ''}>
                          <td className="strong">{s.codigo}</td>
                          <td>
                            <b>{s.nombre}</b>
                            <div className="on-muted" style={{ fontSize: 13 }}>{s.direccion || '—'}</div>
                          </td>
                          <td>{s.ciudad}</td>
                          <td>
                            <div className="on-inline">
                              <IonToggle
                                className="on-toggle"
                                checked={s.activo}
                                onIonChange={(e) => toggleActivo(s.id, e.detail.checked)}
                              />
                              <span className={`on-badge ${s.activo ? 'on-badge--green' : 'on-badge--gray'}`}>
                                {s.activo ? 'Activa' : 'Inactiva'}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="on-row-actions">
                              <button type="button" className="on-row-btn" onClick={() => editar(s)}>
                                Editar
                              </button>
                              <button
                                type="button"
                                className="on-row-btn on-row-btn--danger"
                                onClick={() => setAEliminar(s)}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filtradas.length === 0 && (
                    <div className="on-empty">
                      {sucursales.length === 0
                        ? 'Aún no hay sucursales. Crea la primera.'
                        : 'No se encontraron sucursales con ese criterio.'}
                    </div>
                  )}
                </div>

                <p className="on-muted" style={{ margin: '12px 0 0', fontSize: 13 }}>
                  {filtradas.length} de {sucursales.length} sucursales
                </p>
              </div>

              {/* ---------- Formulario crear / editar ---------- */}
              <div className="on-card">
                <h2>{modoEditar ? 'Editar sucursal' : 'Nueva sucursal'}</h2>

                <div className="on-grid-2 on-field">
                  <div>
                    <label className="on-label">Código</label>
                    <IonInput
                      className="on-input"
                      placeholder="SUC-001"
                      value={form.codigo}
                      onIonInput={(e) => setCampo('codigo', inputValue(e))}
                    />
                  </div>
                  <div>
                    <label className="on-label">Ciudad</label>
                    <IonInput
                      className="on-input"
                      placeholder="Bogotá"
                      value={form.ciudad}
                      onIonInput={(e) => setCampo('ciudad', inputValue(e))}
                    />
                  </div>
                </div>

                <div className="on-field">
                  <label className="on-label">Nombre</label>
                  <IonInput
                    className="on-input"
                    placeholder="Sede Centro"
                    value={form.nombre}
                    onIonInput={(e) => setCampo('nombre', inputValue(e))}
                  />
                </div>

                <div className="on-field">
                  <label className="on-label">Dirección</label>
                  <IonInput
                    className="on-input"
                    placeholder="Cra 7 # 32-16"
                    value={form.direccion}
                    onIonInput={(e) => setCampo('direccion', inputValue(e))}
                  />
                </div>

                <div className="on-field">
                  <label className="on-label">Teléfono</label>
                  <IonInput
                    className="on-input"
                    type="tel"
                    placeholder="601 555 0101"
                    value={form.telefono}
                    onIonInput={(e) => setCampo('telefono', inputValue(e))}
                  />
                </div>

                <div className="on-switch-row on-field">
                  <div>
                    <strong>Sucursal activa</strong>
                    <span>Las inactivas no reciben turnos nuevos.</span>
                  </div>
                  <IonToggle
                    className="on-toggle"
                    checked={form.activo}
                    onIonChange={(e) => setCampo('activo', e.detail.checked)}
                  />
                </div>

                {error && <p className="on-error">{error}</p>}

                <div className="on-actions">
                  <IonButton className="on-btn on-btn--outline" onClick={cancelar}>
                    Cancelar
                  </IonButton>
                  <IonButton className="on-btn on-btn--primary" onClick={guardar}>
                    {modoEditar ? 'Guardar cambios' : 'Crear sucursal'}
                  </IonButton>
                </div>
              </div>
            </div>
          </div>
        </SideLayout>

        {/* ---------- Confirmación de eliminación ---------- */}
        <IonAlert
          isOpen={aEliminar !== null}
          header="Eliminar sucursal"
          message={`¿Seguro que deseas eliminar "${aEliminar?.nombre ?? ''}"? Esta acción no se puede deshacer.`}
          buttons={[
            { text: 'Cancelar', role: 'cancel' },
            { text: 'Eliminar', role: 'destructive', handler: confirmarEliminar },
          ]}
          onDidDismiss={() => setAEliminar(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Sucursales;