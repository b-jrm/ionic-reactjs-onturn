// src/pages/admin/Monitoreo.tsx
import { IonButton, IonContent, IonPage } from '@ionic/react';

import SideLayout from '../../components/SideLayout';

import { adminNav } from './nav';

type EstadoOp = 'En atención' | 'En pausa' | 'Disponible' | 'Desconectada';

const estadoBadge: Record<EstadoOp, string> = {
  'En atención': 'on-badge--green',
  'En pausa': 'on-badge--amber',
  Disponible: 'on-badge--blue',
  Desconectada: 'on-badge--gray',
};

const OPERADORES: { nombre: string; puesto: string; estado: EstadoOp; turno: string; tiempo: string }[] = [
  { nombre: 'Laura Gómez', puesto: 'Puesto 3', estado: 'En atención', turno: 'G-043', tiempo: '04:12' },
  { nombre: 'Andrés Pardo', puesto: 'Puesto 1', estado: 'En atención', turno: 'C-018', tiempo: '02:47' },
  { nombre: 'Marta Ríos', puesto: 'Puesto 2', estado: 'En pausa', turno: 'G-042', tiempo: '03:05' },
  { nombre: 'Julián Torres', puesto: 'Puesto 4', estado: 'Disponible', turno: '—', tiempo: '00:41' },
  { nombre: 'Sofía Díaz', puesto: 'Puesto 5', estado: 'Desconectada', turno: '—', tiempo: '—' },
];

const COLAS = [
  { tipo: 'Atención general', espera: 6 },
  { tipo: 'Asesoría comercial', espera: 4 },
  { tipo: 'Caja y pagos', espera: 3 },
  { tipo: 'Reclamos y PQRS', espera: 2 },
  { tipo: 'Prioritaria', espera: 1 },
];

const STATS = [
  { label: 'Turnos generados', value: '86' },
  { label: 'Atendidos', value: '61' },
  { label: 'En espera', value: '14' },
  { label: 'Espera promedio', value: '09:20' },
  { label: 'Atención promedio', value: '07:32' },
];

const Monitoreo: React.FC = () => {
  const maxEspera = Math.max(...COLAS.map((c) => c.espera));

  return (
    <IonPage>
      <IonContent className="on-content">
        <SideLayout
          items={adminNav}
          activePath="/admin/monitoreo"
          user={{ name: 'Carlos Ruiz', role: 'Administrador' }}
        >
          <div className="on-main">
            <div className="on-main__head">
              <div>
                <h1 className="on-h1">Monitoreo en vivo</h1>
                <p className="on-sub">Jornada de la mañana · 07:30 – 13:00 · Actualizado hace 3 s</p>
              </div>
              <IonButton className="on-btn on-btn--outline">Exportar reporte</IonButton>
            </div>

            <div className="on-stats5">
              {STATS.map((s) => (
                <div className="on-stat" key={s.label}>
                  <span>{s.label}</span>
                  <strong>{s.value}</strong>
                </div>
              ))}
            </div>

            <div className="on-split-mon">
              <div className="on-card">
                <h2>Operadores en vivo</h2>
                <table className="on-table">
                  <thead>
                    <tr>
                      <th>OPERADOR</th>
                      <th>PUESTO</th>
                      <th>ESTADO</th>
                      <th>TURNO</th>
                      <th>TIEMPO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {OPERADORES.map((o) => (
                      <tr key={o.nombre}>
                        <td className="strong">{o.nombre}</td>
                        <td>{o.puesto}</td>
                        <td><span className={`on-badge ${estadoBadge[o.estado]}`}>{o.estado}</span></td>
                        <td className="strong">{o.turno}</td>
                        <td className="on-muted">{o.tiempo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <div className="on-card">
                  <h2>Cola por tipo</h2>
                  {COLAS.map((c) => (
                    <div className="on-bar" key={c.tipo}>
                      <div className="on-bar__top">
                        <b>{c.tipo}</b>
                        <span>{c.espera} en espera</span>
                      </div>
                      <div className="on-bar__track">
                        <div className="on-bar__fill" style={{ width: `${(c.espera / maxEspera) * 60 + 10}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="on-placeholder">Gráfico: turnos por hora</div>
              </div>
            </div>
          </div>
        </SideLayout>
      </IonContent>
    </IonPage>
  );
};

export default Monitoreo;
