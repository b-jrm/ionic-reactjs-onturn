// src/pages/admin/Jornadas.tsx
import { IonButton, IonContent, IonInput, IonPage, IonToggle, IonSelect, IonSelectOption } from '@ionic/react';
import { useState, useEffect } from 'react';

import { Model as ModelJornada } from '../../app/db/models/jornadas';
import { Model as ModelSucursal } from '../../app/db/models/sucursales';
import { Model as ModelTipo } from '../../app/db/models/tipos';
import SideLayout from '../../components/SideLayout';
import { inputValue } from '../../utils/ionValue';

import { adminNav } from './nav';

interface Jornada {
  id: number;
  nombre: string;
  hora_inicio: string;
  hora_fin: string;
  sucursal_id: number;
  activo: number;
  dias: number[]; // 0 = L ... 6 = D
  tipos: number[];
  // puestos: number;
  // estado: 'Activa ahora' | 'Programada' | 'Inactiva';
}

interface DataForeign {
  id: number;
  nombre: string;
}

const DIAS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
const DIAS_TXT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
// const TIPOS = ['General', 'Caja', 'Asesoría', 'Reclamos', 'Prioritaria', 'Cita agendada'];

const VACIO: Jornada = { id: 0, nombre: '', hora_inicio: '08:00', hora_fin: '17:00', sucursal_id: 0, activo: 0, dias: [], tipos: [] };
// const INICIALES: Jornada[] = [
//   { id: 1, nombre: 'Jornada de la mañana', inicio: '07:30', fin: '13:00', dias: [0, 1, 2, 3, 4], puestos: 5, activa: true, estado: 'Activa ahora', tipos: ['General', 'Caja', 'Asesoría', 'Reclamos', 'Prioritaria'] },
//   { id: 2, nombre: 'Jornada de la tarde', inicio: '13:30', fin: '18:00', dias: [0, 1, 2, 3, 4], puestos: 4, activa: false, estado: 'Programada', tipos: ['General', 'Caja'] },
//   { id: 3, nombre: 'Sábados', inicio: '08:00', fin: '12:00', dias: [5], puestos: 2, activa: false, estado: 'Inactiva', tipos: ['General'] },
// ];

const badgeClass = (e: Jornada['activo']) =>
  e === 1 ? 'on-badge--green' : 'on-badge--gray';

const resumenDias = (dias: number[]) => {
  // console.log("dias", dias);
  // console.log("dias.length", dias.length);
  const resumen = dias.length === 5 && dias.every((d, i) => d === i)
  ? 'Lun a Vie'
  : dias.map((d) => DIAS_TXT[d] ).join(', ');
  // console.log("resumen", resumen);
  return resumen;
}

const Jornadas: React.FC = () => {

  const [sucursal, setSucursal] = useState<DataForeign>({id: 0, nombre: ''});
  const [sucursales, setSucursales] = useState<DataForeign[]>([]);

  const [tipos, setTipos] = useState<DataForeign[]>([]);

  const [jornadas, setJornadas] = useState<Jornada[]>([]);
  const [seleccionada, setSeleccionada] = useState<number>(1);
  const [borrador, setBorrador] = useState<Jornada>(VACIO);
  const [error, setError] = useState('');

  const [editandoId, setEditandoId] = useState<number | null>(null); // null = modo crear

  const cargarData = async () => {
      try {
        setTipos( await ModelTipo.getAll("tipo_id AS id, nombre") );
        setSucursales( await ModelSucursal.getAll("sucursal_id AS id, (nombre || ' (' || ciudad || ')') AS nombre") );
        setTimeout(() => {
          // console.log("ModelTipo.getAll", tipos);
          // console.log("ModelSucursal.getAll", sucursales);
          // console.log("data", data);
        }, 500);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    const cargarJornadas = async (idSucursal: number) => {
      try {
        const data = await ModelJornada.getBySucursal(idSucursal);
        setJornadas(data);
        setTimeout(() => {
          // console.log("ModelJornada.getBySucursal", data);
          // console.log("data", data);
        }, 500);
      } catch (error) {
        console.error('Error al cargar jornadas:', error);
        setJornadas([]);
      }
    };
  
    useEffect(() => {
      const cargar = async () => await cargarData();
      void cargar();
    }, []);

    useEffect(() => {
      const cargar = async () => await cargarJornadas(sucursal.id);
      void cargar();
    }, [sucursal]);

  const seleccionar = (j: Jornada) => {
    setSeleccionada(j.id);
    // setBorrador({ ...j });
  };

  const toggleActiva = (id: number, estado: number) => {
    ModelJornada.update(id, {activo: estado});
    setJornadas((prev) =>
      prev.map((j) =>
        j.id === id
          ? { ...j, estado, activo: (estado ? 1 : 0) as Jornada['activo'] }
          : j
      )
    );
  }

  const toggleDia = (i: number) =>
    setBorrador((b) => ({
      ...b,
      dias: b.dias?.includes(i) ? b.dias?.filter((d) => d !== i) : [...b.dias ?? [], i].sort(),
    }));

  const toggleTipo = (t: number) =>
    setBorrador((b) => ({
      ...b,
      tipos: b.tipos?.includes(t) ? b.tipos?.filter((x) => x !== t) : [...b.tipos ?? [], t],
    }));

  const cancelar = () => {
    const original = jornadas.find((j) => j.id === seleccionada);
    if (original) setBorrador({ ...original });
  };

  const nueva = () => {
    setEditandoId(null);
    setBorrador(VACIO);
    setError('');
    // const j: Jornada = {
    //   id: Date.now(), 
    //   nombre: 'Nueva jornada', 
    //   hora_inicio: '08:00', hora_fin: '12:00', 
    //   sucursal_id: 0,
    //   dias: [0, 1, 2, 3, 4], activo: 0
    // };
    // setJornadas((p) => [...p, j]);
    // setJornadas([]);
    // seleccionar(j);
  };

  /* ---------- Guardar (crear o actualizar) ---------- */

  // const guardar = () =>
  //   setJornadas((prev) => prev.map((j) => (j.id === borrador.id ? { ...j, ...borrador } : j)));

  const guardar = async () => {
    
    // console.log("editandoId", editandoId);
    console.log("sucursal", sucursal);
    if (!borrador.nombre.trim() || !borrador.hora_inicio || !borrador.hora_fin || !borrador.dias || !borrador.tipos ) {
      setError('Nombre, horas, dias y tipos de atención son obligatorios.');
      return;
    }

    // setBorrador((b) => [ ...b, { sucursal_id: sucursal.id } ]);

    const payload: Jornada = {
      ...borrador,
      nombre: borrador.nombre.trim(),
      hora_inicio: borrador.hora_inicio,
      hora_fin: borrador.hora_fin,
      sucursal_id: sucursal.id,
      dias: borrador.dias,
      tipos: borrador.tipos,
      activo: 1
    };

    // console.log("borrador", borrador);

    if (editandoId === null) {
      const createdId = ModelJornada.create(payload);
      setJornadas((prev) => [...prev, { ...payload, id: Number(createdId) }]);
    } else {
      ModelJornada.update(editandoId, borrador);
      setJornadas((prev) => prev.map((s) => (s.id === editandoId ? { ...payload, id: s.id } : s)));
    }

    setEditandoId(null);
    setBorrador(VACIO);
    setError('');
  };

  const editar = (s: Jornada) => {
    // const { id, ...resto } = s;
    // console.log("resto", resto);
    setEditandoId(s.id);
    setBorrador(s);
    // console.log("borrador", borrador);
    setError('');
  };

  const modoEditar = editandoId !== null;

  return (
    <IonPage>
      <IonContent className="on-content">
        <SideLayout
          items={adminNav}
          activePath="/manage/workdays"
          user={{ name: 'admin@onturn.co', role: 'Administrador' }}
        >
          <div className="on-main">
            <div className="on-main__head">
              <div>
                <h1 className="on-h1">Jornadas</h1>
                <p className="on-sub">Horarios de atención y jornada activa.</p>
              </div>
              <IonButton className="on-btn on-btn--primary" onClick={nueva}>
                Nueva jornada
              </IonButton>
            </div>

            <IonSelect
              placeholder="Seleccionar Sucursal"
              interface="popover" 
              value={sucursal.id} 
              onIonChange={(e) => {
                  const currentSucursal = sucursales.find(s => s.id === Number(e.detail.value));
                  setSucursal({id: Number(e.detail.value), nombre: currentSucursal?.nombre ?? ''})
                }
              }
            >
              {sucursales.map((s) => (
                <IonSelectOption key={s.id} value={s.id}>{s.nombre}</IonSelectOption>
              ))}
          </IonSelect>

            <div className="on-split">
              {/* Lista */}
              <div className="on-list">
                {jornadas.length > 0 ? (
                  jornadas.map((j) => (
                    <div
                      key={j.id}
                      role="button"
                      tabIndex={0}
                      className={`on-jornada ${editandoId === j.id ? 'is-selected' : ''}`}
                      onClick={() => seleccionar(j)}
                    >
                      <div className="on-jornada__row">
                        <div className="on-jornada__title">
                          {j.nombre}
                          <span className={`on-badge ${badgeClass(j.activo)}`}>{j.activo ? 'Activa' : 'Inactiva'}</span>
                          <IonToggle
                            className="on-toggle"
                            checked={j.activo === 1}
                            onClick={(e) => e.stopPropagation()}
                            onIonChange={(e) => toggleActiva(j.id, e.detail.checked ? 1 : 0)}
                          />
                        </div>
                        <div className="on-row-actions">
                          <button type="button" className="on-row-btn on-row-btn--success" onClick={() => editar(j)}>
                            Editar&nbsp;&rarr;
                          </button>
                          {/* <button type="button" className="on-row-btn on-row-btn--danger" onClick={() => setAEliminar(s)}>
                            Eliminar
                          </button> */}
                        </div>
                      </div>
                      <div className="on-chips">
                        {tipos
                          .filter((t) => j.tipos?.includes(t.id))
                          .map((t) => (
                            <button
                              key={t.id}
                              className="on-chip is-on"
                            >
                              {t.nombre}
                            </button>
                        ))}
                      </div>
                      <div className="on-jornada__meta">
                        {j.hora_inicio} – {j.hora_fin} · {resumenDias(j.dias)}  {/* · {j.puestos} puestos */}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="on-jornada">
                      <div className="on-jornada__row">
                        {sucursal.id === 0 ? (
                          <p className='on-jornada__row--text'>Seleccione una sucursal para ver las jornadas asignadas</p>
                        ) : (
                          <>
                            <p className='on-jornada__row--text'>Sucursal <b>{sucursal.nombre?? ''}</b> no tiene Jornadas asignadas</p>
                              <div className="on-jornada__meta">
                            <IonButton className="on-btn on-btn--primary" onClick={nueva}>
                              Crear jornada
                            </IonButton>
                          </div>
                          </>
                        )}
                      </div>
                    </div>
                )}
              </div>

              {/* Editor */}
              <div className="on-card">
                <h2>{modoEditar ? 'Editar jornada' : 'Crear Jornada'}</h2>

                <div className="on-field">
                  <label className="on-label">Nombre</label>
                  <IonInput
                    className="on-input"
                    placeholder='Nombre Jornada'
                    value={borrador.nombre}
                    onIonInput={(e) => setBorrador({ ...borrador, nombre: inputValue(e) })}
                  />
                </div>

                <div className="on-grid-2 on-field">
                  <div>
                    <label className="on-label">Hora Inicio</label>
                    <IonInput
                      type="time" 
                      className="on-input"
                      value={borrador.hora_inicio}
                      onIonInput={(e) => setBorrador({ ...borrador, hora_inicio: inputValue(e) })}
                    />
                  </div>
                  <div>
                    <label className="on-label">Hora Fin</label>
                    <IonInput 
                      type="time" 
                      className="on-input"
                      value={borrador.hora_fin}
                      onIonInput={(e) => setBorrador({ ...borrador, hora_fin: inputValue(e) })}
                    />
                  </div>
                </div>

                <label className="on-label">Días</label>
                <div className="on-days">
                  {DIAS.map((d, i) => (
                    <button
                      key={d + i}
                      className={`on-day ${borrador.dias?.includes(i) ? 'is-on' : ''}`}
                      onClick={() => toggleDia(i)}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                <label className="on-label">Tipos de atención habilitados</label>
                <div className="on-chips">
                  {tipos.map((t) => (
                    <button
                      key={t.id}
                      className={`on-chip ${borrador.tipos?.includes(t.id) ? 'is-on' : ''}`}
                      onClick={() => toggleTipo(t.id)}
                    >
                      {t.nombre}
                    </button>
                  ))}
                </div>

                {error && <p className="on-error">{error}</p>}

                <div className="on-actions">
                  <IonButton className="on-btn on-btn--outline" onClick={cancelar} disabled={sucursal.id > 0 ? false : true }>Cancelar</IonButton>
                  <IonButton className="on-btn on-btn--primary" disabled={sucursal.id > 0 ? false : true } title={sucursal.id === 0 ? 'Seleccione una sucursal' : ''} onClick={guardar}>
                    {modoEditar ? 'Guardar cambios' : 'Crear jornada'}
                  </IonButton>
                </div>
              </div>
            </div>
          </div>
        </SideLayout>
      </IonContent>
    </IonPage>
  );
};

export default Jornadas;
