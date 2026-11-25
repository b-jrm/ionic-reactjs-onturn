// src/pages/admin/Sucursales.tsx
// CRUD de sucursales (Ionic 7.2.1 + React Router v5)
import { IonAlert, IonButton, IonContent, IonInput, IonPage, IonToggle, IonSelect, IonSelectOption } from '@ionic/react';
import { useMemo, useState, useEffect } from 'react';

import { Model as ModelPerfil } from '../../app/db/models/perfiles';
import { Model } from '../../app/db/models/usuarios';
import SideLayout from '../../components/SideLayout';
import { inputValue } from '../../utils/ionValue';
// import { testSQLite } from '../SQLiteTest';

import { adminNav } from './nav';

interface Data {
  id: number;
  correo_electronico: string;
  perfil_id: number;
  activo: number;
}

interface DataForeign {
  id: number;
  nombre: string;
}

type FormData = Omit<Data, 'id'>;

const VACIA: FormData = {
  correo_electronico: '',
  perfil_id: 0,
  activo: 1,
};

const Positions: React.FC = () => {

  // testSQLite();

  const [data, setData] = useState<Data[]>([]);
  const [perfiles, setPerfiles] = useState<DataForeign[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null); // null = modo crear
  const [form, setForm] = useState<FormData>(VACIA);
  const [error, setError] = useState('');
  const [aEliminar, setAEliminar] = useState<Data | null>(null);

  const cargarData = async () => {
    try {
      setData( await Model.getAll() );
      setPerfiles( await ModelPerfil.getAll("perfil_id AS id, nombre") );
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
      [d.correo_electronico].some((campo) => campo.toLowerCase().includes(q))
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
    
    const valErrors = [];
    if (!form.correo_electronico.trim()) valErrors.push("Correo electronico es obligatorio");
    if( !form.perfil_id ) valErrors.push("Perfil es obligatorio");

    if( valErrors.length > 0 ){
        setError("Corrigue los datos: "+valErrors.join(","));
        return;
    }

    const limpia: FormData = {
      ...form,
      correo_electronico: form.correo_electronico.trim(),
      perfil_id: form.perfil_id,
    };

    if (editandoId === null) {
      const createdId = Model.create(limpia);
      setData((prev) => [...prev, { ...limpia, id: Number(createdId) }]);
    } else {
      Model.update(editandoId, limpia);
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
          activePath="/manage/users"
          user={{ name: 'admin@onturn.co', role: 'Administrador' }}
        >
          <div className="on-main">
            <div className="on-main__head">
              <div>
                <h1 className="on-h1">Usuarios / Asesores</h1>
                <p className="on-sub">Crea, Asigna, Actualiza o Inactiva Usuarios.</p>
              </div>
              <IonButton className="on-btn on-btn--primary" onClick={nueva}>
                Nuevo usuario
              </IonButton>
            </div>

            <div className="on-split">
              {/* ---------- Listado ---------- */}
              <div className="on-card">
                <div className="on-toolbar">
                  <h2 style={{ margin: 0 }}>Listado</h2>
                  <IonInput
                    className="on-input on-toolbar__search"
                    placeholder="Buscar por correo electronico"
                    value={busqueda}
                    onIonInput={(e) => setBusqueda(inputValue(e))}
                  />
                </div>

                <div className="on-table-wrap">
                  <table className="on-table">
                    <thead>
                      <tr>
                        <th>TIPO DE USUARIO</th>
                        <th>CORREO ELECTRONICO</th>
                        <th>ESTADO</th>
                        <th style={{ textAlign: 'right' }}>ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtradas.map((s) => (
                        <tr key={s.id} className={editandoId === s.id ? 'is-selected' : ''}>
                          <td className="strong">
                            <b>{perfiles.find((p) => p.id === s.perfil_id)?.nombre}</b>
                          </td>
                          <td>{s.correo_electronico}</td>
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
                        ? 'Aún no hay usuarios. Crea el primero.'
                        : 'No se encontraron usuarios con ese criterio.'}
                    </div>
                  )}
                </div>

                <p className="on-muted" style={{ margin: '12px 0 0', fontSize: 13 }}>
                  {filtradas.length} de {data.length} usuarios
                </p>
              </div>

              {/* ---------- Formulario crear / editar ---------- */}
              <div className="on-card">
                <h2>{modoEditar ? 'Editar usuario' : 'Nuevo usuario'}</h2>

                <div className="on-field">
                  <label className="on-label">Correo electrónico</label>
                  <IonInput
                      type='email'
                      className="on-input"
                      placeholder="Correo electrónico"
                      value={form.correo_electronico}
                      onIonInput={(e) => setCampo('correo_electronico', inputValue(e))}
                  />
                </div>

                <div className="on-field">
                    <label className="on-label">Perfil</label>
                    <IonSelect
                        placeholder="Seleccionar Sucursal"
                        interface="popover" 
                        value={form.perfil_id} 
                        onIonChange={(e) => setCampo('perfil_id', Number(e.detail.value))}
                    >
                        {perfiles.map((s) => (
                          <IonSelectOption key={s.id} value={s.id}>{s.nombre}</IonSelectOption>
                        ))}
                    </IonSelect>
                </div>

                {error && <p className="on-error">{error}</p>}

                <div className="on-actions">
                  <IonButton className="on-btn on-btn--outline" onClick={cancelar}>
                    Cancelar
                  </IonButton>
                  <IonButton className="on-btn on-btn--primary" onClick={guardar}>
                    {modoEditar ? 'Guardar cambios' : 'Crear usuario'}
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
          message={`¿Seguro que deseas eliminar "${aEliminar?.correo_electronico ?? ''}"? Esta acción no se puede deshacer.`}
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