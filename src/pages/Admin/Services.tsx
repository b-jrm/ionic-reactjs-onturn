// src/pages/admin/Sucursales.tsx
// CRUD de sucursales (Ionic 7.2.1 + React Router v5)
import { IonAlert, IonButton, IonContent, IonInput, IonPage, IonToggle } from '@ionic/react';
import { useMemo, useState, useEffect } from 'react';

import { Model } from '../../app/db/models/tipos';
import SideLayout from '../../components/SideLayout';
import { inputValue } from '../../utils/ionValue';
// import { testSQLite } from '../SQLiteTest';

import { adminNav } from './nav';

interface Data {
  id: number;
  nombre: string;
  prefijo: string;
  secuencia_inicial: number;
  descripcion: string;
  activo: number;
}

type FormData = Omit<Data, 'id'>;

const VACIA: FormData = {
  nombre: '',
  prefijo: '',
  secuencia_inicial: 1,
  descripcion: '',
  activo: 1
};

const Services: React.FC = () => {

  // testSQLite();

  const [data, setData] = useState<Data[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null); // null = modo crear
  const [form, setForm] = useState<FormData>(VACIA);
  const [error, setError] = useState('');
  const [aEliminar, setAEliminar] = useState<Data | null>(null);

  const cargarData = async () => {
    try {
      setData( await Model.getAll() );
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
    const valErrors = [];
    if (!form.nombre.trim()) valErrors.push("Nombre es obligatorio");
    if( !form.prefijo.trim() ) valErrors.push("Prefijo es obligatorio");
    if( !form.secuencia_inicial ) valErrors.push("Secuencia inicial debe ser mayor a 0");

    if( valErrors.length > 0 ){
        setError("Corrigue los datos: "+valErrors.join(","));
        return;
    }

    const limpia: FormData = {
      ...form,
      nombre: form.nombre.trim(),
      prefijo: form.prefijo.trim(),
      secuencia_inicial: form.secuencia_inicial,
      descripcion: form.descripcion.trim(),
    };

    if (editandoId === null) {
      const createdId = Model.create(limpia);
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
          activePath="/manage/services"
          user={{ name: 'Carlos Ruiz', role: 'Administrador' }}
        >
          <div className="on-main">
            <div className="on-main__head">
              <div>
                <h1 className="on-h1">Tipos de Servicios</h1>
                <p className="on-sub">Crea, Asigna, Actualiza o Inactiva servicios de atención.</p>
              </div>
              <IonButton className="on-btn on-btn--primary" onClick={nueva}>
                Nuevo tipo
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
                        <th>NOMBRE</th>
                        <th>PREFIJO-SECUENCIA INICIAL</th>
                        <th>DESCRIPCION</th>
                        <th>ESTADO</th>
                        <th style={{ textAlign: 'right' }}>ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtradas.map((s) => (
                        <tr key={s.id} className={editandoId === s.id ? 'is-selected' : ''}>
                          <td className="strong">
                            <b>{s.nombre}</b>
                          </td>
                          <td>{s.prefijo}-{s.secuencia_inicial}</td>
                          <td>{s.descripcion}</td>
                          <td>
                            <div className="on-inline">
                              <IonToggle
                                className="on-toggle"
                                checked={s.activo === 1}
                                onIonChange={(e) => toggleActiva(s.id, (e.detail.checked ? 1 : 0))}
                              />
                              <span className={`on-badge ${s.activo ? 'on-badge--green' : 'on-badge--gray'}`}>
                                {s.activo ? 'Activo' : 'Inactivo'}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="on-row-actions">
                              <button type="button" className="on-row-btn on-row-btn--success" onClick={() => editar(s)}>
                                Editar
                              </button>
                              {/* <button type="button" className="on-row-btn on-row-btn--danger" onClick={() => setAEliminar(s)}>
                                Eliminar
                              </button> */}
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
                <h2>{modoEditar ? 'Editar tipo de servicio' : 'Nuevo tipo de servicio'}</h2>

                <div className="on-field">
                  <label className="on-label">Nombre</label>
                  <IonInput
                    className="on-input"
                    placeholder="Nombre de servicio"
                    value={form.nombre}
                    onIonInput={(e) => setCampo('nombre', inputValue(e))}
                  />
                </div>

                <div className="on-grid-2 on-field">
                  <div>
                    <label className="on-label">Prefijo</label>
                    <IonInput
                        className="on-input"
                        placeholder="Prefijo de turnos"
                        value={form.prefijo}
                        onIonInput={(e) => setCampo('prefijo', inputValue(e))}
                    />
                  </div>
                  <div>
                    <label className="on-label">Secuencia inicial</label>
                    <IonInput
                        className="on-input"
                        placeholder="1"
                        value={form.secuencia_inicial}
                        onIonInput={(e) => setCampo('secuencia_inicial', Number(e.detail.value))}
                    />
                  </div>
                </div>

                <div className="on-field">
                  <label className="on-label">Descripción</label>
                  <IonInput
                    className="on-input"
                    placeholder="Descripción"
                    value={!form.descripcion.length ? form.nombre : form.descripcion}
                    onIonInput={(e) => setCampo('descripcion', inputValue(e))}
                  />
                </div>

                {error && <p color="danger" className="on-error">{error}</p>}

                <div className="on-actions">
                  <IonButton className="on-btn on-btn--outline" onClick={cancelar}>
                    Cancelar
                  </IonButton>
                  <IonButton className="on-btn on-btn--primary" onClick={guardar}>
                    {modoEditar ? 'Guardar cambios' : 'Crear tipo de servicio'}
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
          message={`¿Seguro que deseas eliminar "${aEliminar?.nombre ?? ''} ${aEliminar?.descripcion ?? ''}"? Esta acción no se puede deshacer.`}
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

export default Services;