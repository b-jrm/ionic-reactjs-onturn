// src/pages/operador/PanelAtencion.tsx
// Vista responsive: sidebar en escritorio, encabezado oscuro en móvil.
import { IonButton, IonContent, IonPage } from '@ionic/react';

import SideLayout from '../../components/SideLayout';
import type { NavItem } from '../../components/SideLayout';

const operadorNav: NavItem[] = [
  { label: 'Atención', to: '/operador' },
  { label: 'Historial de hoy', to: '/operador/historial' },
  { label: 'Mi perfil', to: '/operador/perfil' },
];

const COLA = [
  { codigo: 'P-005', tipo: 'Prioritaria', min: 14 },
  { codigo: 'G-044', tipo: 'General', min: 8 },
  { codigo: 'G-045', tipo: 'General', min: 6 },
  { codigo: 'G-046', tipo: 'General', min: 4 },
  { codigo: 'G-047', tipo: 'General', min: 2 },
  { codigo: 'G-048', tipo: 'General', min: 1 },
];

const PanelAtencion: React.FC = () => {
  // TODO: conectar con el estado real del turno en curso
  const actual = { codigo: 'G-043', tipo: 'Atención general', tiempo: '04:12' };

  const stats = (
    <div className="on-stats3">
      <div className="on-stat"><span className="on-only-mobile">Atendidos</span><span className="on-op-desktop-only">Atendidos hoy</span><strong>18</strong></div>
      <div className="on-stat"><span className="on-only-mobile">Promedio</span><span className="on-op-desktop-only">Tiempo promedio</span><strong>07:32</strong></div>
      <div className="on-stat"><span className="on-only-mobile">En cola</span><span className="on-op-desktop-only">En espera</span><strong>6</strong></div>
    </div>
  );

  return (
    <IonPage>
      <IonContent className="on-content">
        {/* Encabezado móvil */}
        <div className="on-op-mobile-head">
          <div>
            <strong>Laura Gómez</strong>
            <span>Puesto 3 · Jornada mañana</span>
          </div>
          <span className="on-live">● Activa</span>
        </div>

        <SideLayout
          items={operadorNav}
          activePath="/operador"
          user={{ name: 'Laura Gómez', role: 'Operadora · Puesto 3' }}
          userOnTop
        >
          <div className="on-main">
            {/* Encabezado escritorio */}
            <div className="on-main__head on-op-desktop-head">
              <div>
                <h1 className="on-h1">Panel de atención</h1>
                <p className="on-sub">Jornada de la mañana · Atención general</p>
              </div>
              <span style={{ color: 'var(--on-green-text)', fontWeight: 600 }}>● Conectada</span>
            </div>

            {stats}

            <div className="on-op-grid">
              {/* Turno actual */}
              <div className="on-card on-current">
                <div className="on-current__top">
                  <span className="on-badge on-badge--green" style={{ fontSize: 15, padding: '6px 16px' }}>
                    En atención
                  </span>
                  <span className="on-current__timer">{actual.tiempo}</span>
                </div>
                <div className="on-current__label">Turno actual</div>
                <div className="on-current__num">{actual.codigo}</div>
                <div className="on-current__tipo">{actual.tipo}</div>

                <div className="on-actions3">
                  <IonButton className="on-btn on-btn--outline">
                    <span className="on-op-desktop-only">Repetir llamado</span>
                    <span className="on-only-mobile">Repetir</span>
                  </IonButton>
                  <IonButton className="on-btn on-btn--warn">Pausar</IonButton>
                  <IonButton className="on-btn on-btn--danger">Finalizar</IonButton>
                </div>

                <div className="on-op-desktop-only">
                  <IonButton className="on-btn on-btn--primary on-btn--block on-btn--lg">
                    Llamar siguiente turno
                  </IonButton>
                </div>
              </div>

              {/* Cola */}
              <div className="on-card on-queue--card">
                <div className="on-queue__head">
                  <h2>
                    <span className="on-op-desktop-only">En espera</span>
                    <span className="on-only-mobile">Siguientes</span>
                  </h2>
                  <span className="on-muted">
                    <span className="on-only-mobile">{COLA.length} en espera</span>
                    <span className="on-op-desktop-only">{COLA.length} turnos</span>
                  </span>
                </div>
                <div className="on-queue">
                  {COLA.map((t) => (
                    <div className="on-queue__item" key={t.codigo}>
                      <span className="code">{t.codigo}</span>
                      <span className="tipo">{t.tipo}</span>
                      <span className="min">{t.min} min</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Botón fijo móvil */}
            <div className="on-only-mobile on-op-sticky">
              <IonButton className="on-btn on-btn--primary on-btn--block on-btn--lg">
                Llamar siguiente turno
              </IonButton>
            </div>
          </div>
        </SideLayout>
      </IonContent>
    </IonPage>
  );
};

export default PanelAtencion;
