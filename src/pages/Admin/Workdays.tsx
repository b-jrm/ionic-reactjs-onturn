// src/pages/admin/Jornadas.tsx
import { IonButton, IonContent, IonInput, IonPage, IonToggle, IonSelect, IonSelectOption } from '@ionic/react';
import { useState, useEffect } from 'react';

import { Model as ModelSucursal } from '../../app/db/models/sucursales';
import SideLayout from '../../components/SideLayout';
import { inputValue } from '../../utils/ionValue';

import { adminNav } from './nav';

interface Jornada {
  id: number;
  nombre: string;
  inicio: string;
  fin: string;
  dias: number[]; // 0 = L ... 6 = D
  puestos: number;
  activa: boolean;
  estado: 'Activa ahora' | 'Programada' | 'Inactiva';
  tipos: string[];
}

interface DataForeign {
  id: number;
  nombre: string;
}

const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const DIAS_TXT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const TIPOS = ['General', 'Caja', 'Asesoría', 'Reclamos', 'Prioritaria', 'Cita agendada'];

const INICIALES: Jornada[] = [
  { id: 1, nombre: 'Jornada de la mañana', inicio: '07:30', fin: '13:00', dias: [0, 1, 2, 3, 4], puestos: 5, activa: true, estado: 'Activa ahora', tipos: ['General', 'Caja', 'Asesoría', 'Reclamos', 'Prioritaria'] },
  { id: 2, nombre: 'Jornada de la tarde', inicio: '13:30', fin: '18:00', dias: [0, 1, 2, 3, 4], puestos: 4, activa: false, estado: 'Programada', tipos: ['General', 'Caja'] },
  { id: 3, nombre: 'Sábados', inicio: '08:00', fin: '12:00', dias: [5], puestos: 2, activa: false, estado: 'Inactiva', tipos: ['General'] },
];

const badgeClass = (e: Jornada['estado']) =>
  e === 'Activa ahora' ? 'on-badge--green' : e === 'Programada' ? 'on-badge--blue' : 'on-badge--gray';

const resumenDias = (dias: number[]) =>
  dias.length === 5 && dias.every((d, i) => d === i)
    ? 'Lun a Vie'
    : dias.map((d) => DIAS_TXT[d]).join(', ');

const Jornadas: React.FC = () => {

  const [sucursal, setSucursal] = useState<number>(0);
  const [sucursales, setSucursales] = useState<DataForeign[]>([]);

  const [jornadas, setJornadas] = useState<Jornada[]>(INICIALES);
  const [seleccionada, setSeleccionada] = useState<number>(1);
  const [borrador, setBorrador] = useState<Jornada>(INICIALES[0]);

  const cargarData = async () => {
      try {
        setSucursales( await ModelSucursal.getAll("sucursal_id AS id, (nombre || ' (' || ciudad || ')') AS nombre") );
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

  const seleccionar = (j: Jornada) => {
    setSeleccionada(j.id);
    setBorrador({ ...j });
  };

  const toggleActiva = (id: number, activa: boolean) =>
    setJornadas((prev) =>
      prev.map((j) =>
        j.id === id
          ? { ...j, activa, estado: (activa ? 'Activa ahora' : 'Inactiva') as Jornada['estado'] }
          : j
      )
    );

  const toggleDia = (i: number) =>
    setBorrador((b) => ({
      ...b,
      dias: b.dias.includes(i) ? b.dias.filter((d) => d !== i) : [...b.dias, i].sort(),
    }));

  const toggleTipo = (t: string) =>
    setBorrador((b) => ({
      ...b,
      tipos: b.tipos.includes(t) ? b.tipos.filter((x) => x !== t) : [...b.tipos, t],
    }));

  const guardar = () =>
    setJornadas((prev) => prev.map((j) => (j.id === borrador.id ? { ...j, ...borrador } : j)));

  const cancelar = () => {
    const original = jornadas.find((j) => j.id === seleccionada);
    if (original) setBorrador({ ...original });
  };

  const nueva = () => {
    const j: Jornada = {
      id: Date.now(), nombre: 'Nueva jornada', inicio: '08:00', fin: '12:00',
      dias: [0, 1, 2, 3, 4], puestos: 1, activa: false, estado: 'Inactiva', tipos: ['General'],
    };
    setJornadas((p) => [...p, j]);
    seleccionar(j);
  };

  return (
    <IonPage>
      <IonContent className="on-content">
        <SideLayout
          items={adminNav}
          activePath="/manage/workdays"
          user={{ name: 'Carlos Ruiz', role: 'Administrador' }}
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
              interface="action-sheet" 
              value={sucursal} 
              onIonChange={(e) => setSucursal(e.detail.value)}
          >
              {sucursales.map((s) => (
                <IonSelectOption key={s.id} value={s.id}>{s.nombre}</IonSelectOption>
              ))}
          </IonSelect>

            <div className="on-split">
              {/* Lista */}
              <div className="on-list">
                {jornadas.map((j) => (
                  <div
                    key={j.id}
                    role="button"
                    tabIndex={0}
                    className={`on-jornada ${seleccionada === j.id ? 'is-selected' : ''}`}
                    onClick={() => seleccionar(j)}
                  >
                    <div className="on-jornada__row">
                      <div className="on-jornada__title">
                        {j.nombre}
                        <span className={`on-badge ${badgeClass(j.estado)}`}>{j.estado}</span>
                      </div>
                      <IonToggle
                        className="on-toggle"
                        checked={j.activa}
                        onClick={(e) => e.stopPropagation()}
                        onIonChange={(e) => toggleActiva(j.id, e.detail.checked)}
                      />
                    </div>
                    <div className="on-jornada__meta">
                      {j.inicio} – {j.fin} · {resumenDias(j.dias)} · {j.puestos} puestos
                    </div>
                  </div>
                ))}
              </div>

              {/* Editor */}
              <div className="on-card">
                <h2>Editar jornada</h2>

                <div className="on-field">
                  <label className="on-label">Nombre</label>
                  <IonInput
                    className="on-input"
                    value={borrador.nombre}
                    onIonInput={(e) => setBorrador({ ...borrador, nombre: inputValue(e) })}
                  />
                </div>

                <div className="on-grid-2 on-field">
                  <div>
                    <label className="on-label">Inicio</label>
                    <IonInput
                      className="on-input"
                      value={borrador.inicio}
                      onIonInput={(e) => setBorrador({ ...borrador, inicio: inputValue(e) })}
                    />
                  </div>
                  <div>
                    <label className="on-label">Fin</label>
                    <IonInput
                      className="on-input"
                      value={borrador.fin}
                      onIonInput={(e) => setBorrador({ ...borrador, fin: inputValue(e) })}
                    />
                  </div>
                </div>

                <label className="on-label">Días</label>
                <div className="on-days">
                  {DIAS.map((d, i) => (
                    <button
                      key={d + i}
                      className={`on-day ${borrador.dias.includes(i) ? 'is-on' : ''}`}
                      onClick={() => toggleDia(i)}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                <label className="on-label">Tipos de atención habilitados</label>
                <div className="on-chips">
                  {TIPOS.map((t) => (
                    <button
                      key={t}
                      className={`on-chip ${borrador.tipos.includes(t) ? 'is-on' : ''}`}
                      onClick={() => toggleTipo(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="on-actions">
                  <IonButton className="on-btn on-btn--outline" onClick={cancelar}>Cancelar</IonButton>
                  <IonButton className="on-btn on-btn--primary" onClick={guardar}>Guardar</IonButton>
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
