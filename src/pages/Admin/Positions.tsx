// src/pages/admin/Sucursales.tsx
// CRUD de sucursales (Ionic 7.2.1 + React Router v5)
import { IonAlert, IonButton, IonContent, IonInput, IonPage, IonToggle, IonSelect, IonSelectOption } from '@ionic/react';
import { useMemo, useState, useEffect } from 'react';

import { Model } from '../../app/db/models/puestos';
import { Model as ModelSucursal } from '../../app/db/models/sucursales';
import { Model as ModelUsuario } from '../../app/db/models/usuarios';
import SideLayout from '../../components/SideLayout';
import { inputValue } from '../../utils/ionValue';
// import { testSQLite } from '../SQLiteTest';

import { adminNav } from './nav';

interface Data {
  id: number;
  nombre: string;
  numero: number | string;
  sucursal_id: number;
  sucursal?: string;
  usuario_id: number;
  usuario?: string;
  activo: number;
}

interface DataForeign {
  id: number;
  nombre: string;
}

type FormData = Omit<Data, 'id'>;

const VACIA: FormData = {
  nombre: '',
  numero: '',
  sucursal_id: 0,
  sucursal: '',
  usuario_id: 0,
  usuario: '',
  activo: 1,
};

const Positions: React.FC = () => {

  // testSQLite();

  const [data, setData] = useState<Data[]>([]);
  const [sucursales, setSucursales] = useState<DataForeign[]>([]);
  const [usuarios, setUsuario] = useState<DataForeign[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null); // null = modo crear
  const [form, setForm] = useState<FormData>(VACIA);
  const [error, setError] = useState('');
  const [aEliminar, setAEliminar] = useState<Data | null>(null);

  const cargarData = async () => {
    try {
      setData( await Model.getAll() );
      // console.log("ModelSucursal.getAll", await ModelSucursal.getAll("sucursal_id AS id, nombre"));
      setSucursales( await ModelSucursal.getAll("sucursal_id AS id, (nombre || ' (' || ciudad || ')') AS nombre") );
    //   console.log("sucursales",sucursales);
      setUsuario( await ModelUsuario.getAll("usuario_id AS id, correo_electronico AS nombre") );
    //   console.log("usuarios",usuarios);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
  };

  useEffect(() => {
    const cargar = async () => {
      await cargarData();
    };
    void cargar();
  }, []);

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return data;
    return data.filter((d) =>
      [d.nombre].some((campo) => campo.toLowerCase().includes(q))
    );
  }, [data, busqueda]);

  const setCampo = <K extends keyof FormData>(campo: K, valor: FormData[K]) => {
    //   console.log("setCampo", campo+": "+valor);
      setForm((f) => ({ ...f, [campo]: valor }));
  }
    

  /* ---------- Crear ---------- */
  const nueva = () => {
    setEditandoId(null);
    setForm(VACIA);
    setError('');
  };

  /* ---------- Editar (cargar en el formulario) ---------- */
  const editar = (s: Data) => {
    const { id, ...resto } = s;
    // console.log("resto", resto);
    setEditandoId(id);
    setForm(resto);
    setError('');
  };

  /* ---------- Guardar (crear o actualizar) ---------- */
  const guardar = async () => {
    // console.log("form", form);
    if (!form.nombre.trim() || !form.numero) {
      setError('Nombre y número son obligatorios.');
      return;
    }

    const limpia: FormData = {
      ...form,
      nombre: form.nombre.trim(),
      numero: form.numero,
      sucursal_id: form.sucursal_id,
      sucursal: form.sucursal?.trim(),
      usuario_id: form.usuario_id,
      usuario: form.usuario?.trim(),
    };

    if (editandoId === null) {
      const createdId = Model.create(form);
      setData((prev) => [...prev, { ...limpia, id: Number(createdId) }]);
    } else {
      Model.update(editandoId, form);
      setData((prev) => prev.map((s) => (s.id === editandoId ? { id: s.id, ...limpia } : s)));
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
  const toggleActiva = (id: number, activo: number) => {
    Model.update(id, { activo: activo });
    setData((prev) => prev.map((s) => (s.id === id ? { ...s, activo } : s)));
  }

  /* ---------- Eliminar ---------- */
  const confirmarEliminar = () => {
    if (!aEliminar) return;
    setData((prev) => prev.filter((s) => s.id !== aEliminar.id));
    Model.delete(aEliminar.id);
    if (editandoId === aEliminar.id) cancelar();
    setAEliminar(null);
  };

  const modoEditar = editandoId !== null;

  return (
    <IonPage>
      <IonContent className="on-content">
        <SideLayout
          items={adminNav}
          activePath="/manage/positions"
          user={{ name: 'Carlos Ruiz', role: 'Administrador' }}
        >
          <div className="on-main">
            <div className="on-main__head">
              <div>
                <h1 className="on-h1">Puestos</h1>
                <p className="on-sub">Crea, Asigna, Actualiza o Inactiva Puestos.</p>
              </div>
              <IonButton className="on-btn on-btn--primary" onClick={nueva}>
                Nuevo puesto
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
                        <th>PUESTO</th>
                        <th>SUCURSAL</th>
                        <th>USUARIO</th>
                        <th>ESTADO</th>
                        <th style={{ textAlign: 'right' }}>ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtradas.map((s) => (
                        <tr key={s.id} className={editandoId === s.id ? 'is-selected' : ''}>
                          <td className="strong">
                            <b>{s.nombre}&nbsp;{s.numero}</b>
                          </td>
                          <td>{s.sucursal}</td>
                          <td>{s.usuario?.split('@')[0]}</td>
                          <td>
                            <div className="on-inline">
                              <IonToggle
                                className="on-toggle"
                                checked={s.activo === 1}
                                onIonChange={(e) => toggleActiva(s.id, (e.detail.checked ? 1 : 0))}
                              />
                              <span className={`on-badge ${s.activo ? 'on-badge--green' : 'on-badge--gray'}`}>
                                {s.activo ? 'Activa' : 'Inactiva'}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="on-row-actions">
                              <button type="button" className="on-row-btn on-row-btn--success" onClick={() => editar(s)}>
                                Editar
                              </button>
                              <button type="button" className="on-row-btn on-row-btn--danger" onClick={() => setAEliminar(s)}>
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
                      {data.length === 0
                        ? 'Aún no hay puestos. Crea el primero.'
                        : 'No se encontraron puestos con ese criterio.'}
                    </div>
                  )}
                </div>

                <p className="on-muted" style={{ margin: '12px 0 0', fontSize: 13 }}>
                  {filtradas.length} de {data.length} puestos
                </p>
              </div>

              {/* ---------- Formulario crear / editar ---------- */}
              <div className="on-card">
                <h2>{modoEditar ? 'Editar puesto' : 'Nuevo puesto'}</h2>

                <div className="on-grid-2 on-field">
                  <div>
                    <label className="on-label">Nombre</label>
                    <IonInput
                        className="on-input"
                        placeholder="Caja / Asesor"
                        value={form.nombre}
                        onIonInput={(e) => setCampo('nombre', inputValue(e))}
                    />
                  </div>
                  <div>
                    <label className="on-label">Número</label>
                    <IonInput
                        className="on-input"
                        placeholder="0"
                        value={form.numero}
                        onIonInput={(e) => setCampo('numero', inputValue(e))}
                    />
                  </div>
                </div>

                <div className="on-field">
                    <label className="on-label">Sucursal</label>
                    <IonSelect
                        placeholder="Seleccionar Sucursal"
                        interface="popover" 
                        value={form.sucursal_id} 
                        onIonChange={(e) => {
                            const sucursal = sucursales.find(u => u.id === Number(e.detail.value));
                            setCampo('sucursal_id', e.detail.value);
                            setCampo('sucursal', sucursal?.nombre ?? '');
                        }}
                    >
                        {sucursales.map((s) => (
                          <IonSelectOption key={s.id} value={s.id}>{s.nombre}</IonSelectOption>
                        ))}
                    </IonSelect>
                </div>

                <div className="on-field">
                  <label className="on-label">Usuario</label>
                    <IonSelect
                        placeholder="Seleccionar Usuario"
                        interface="popover" 
                        value={form.usuario_id} 
                        onIonChange={(e) => {
                            const usuario = usuarios.find(u => u.id === Number(e.detail.value));
                            setCampo('usuario_id', e.detail.value);
                            setCampo('usuario', usuario?.nombre ?? '');
                        }}
                    >
                        {usuarios.map((u) => (
                          <IonSelectOption key={u.id} value={u.id}>{u.nombre}</IonSelectOption>
                        ))}
                    </IonSelect>
                </div>

                <div className="on-switch-row on-field">
                  <div>
                    <strong>Puesto activo&nbsp;&nbsp;</strong>
                    <span>Los inactivos no pueden atender turnos.</span>
                  </div>
                  <IonToggle
                    className="on-toggle"
                    checked={form.activo === 1}
                    onIonChange={(e) => setCampo('activo', (e.detail.checked ? 1 : 0))}
                  />
                </div>

                {error && <p className="on-error">{error}</p>}

                <div className="on-actions">
                  <IonButton className="on-btn on-btn--outline" onClick={cancelar}>
                    Cancelar
                  </IonButton>
                  <IonButton className="on-btn on-btn--primary" onClick={guardar}>
                    {modoEditar ? 'Guardar cambios' : 'Crear puesto'}
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
          message={`¿Seguro que deseas eliminar "${aEliminar?.nombre ?? ''} ${aEliminar?.numero ?? ''}"? Esta acción no se puede deshacer.`}
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

export default Positions;