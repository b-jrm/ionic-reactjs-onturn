// src/pages/cliente/MiTurno.tsx
import { IonButton, IonContent, IonPage, IonToggle, useIonRouter } from '@ionic/react';
import { useState } from 'react';

const MiTurno: React.FC = () => {
  const history = useIonRouter();
  const [avisar, setAvisar] = useState(true);

  // TODO: reemplazar con datos reales (API / websocket)
  const turno = {
    numero: 'G-042',
    tipo: 'Atención general',
    generado: '9:41',
    antesQueTu: 5,
    esperaMin: 12,
    atendiendo: { numero: 'G-037', puesto: 'Puesto 2' },
    estado: 'En espera',
  };

  return (
    <IonPage>
      <IonContent className="on-content">
        <div className="on-mobile" style={{ minHeight: '100%' }}>
          <div className="on-mobile__top">
            <strong>Onturn</strong>
            <span className="on-badge on-badge--gray" style={{ padding: '10px 18px', fontSize: 15 }}>
              {turno.estado}
            </span>
          </div>

          <div>
            <div className="on-muted" style={{ fontSize: 16 }}>Tu turno</div>
            <h1 className="on-h1" style={{ fontSize: 30 }}>{turno.tipo}</h1>
          </div>

          <div className="on-ticket">
            <small>NÚMERO DE TURNO</small>
            <div className="on-ticket__num">{turno.numero}</div>
            <div className="on-ticket__time">Generado hoy a las {turno.generado}</div>
          </div>

          <div className="on-two">
            <div className="on-box">
              <span>Antes que tú</span>
              <strong>{turno.antesQueTu}</strong>
            </div>
            <div className="on-box">
              <span>Espera aprox.</span>
              <strong>{turno.esperaMin} min</strong>
            </div>
          </div>

          <div className="on-box on-box--row">
            <div className="tag">{turno.atendiendo.numero}</div>
            <div>
              <span>Atendiendo ahora</span>
              <strong>{turno.atendiendo.puesto}</strong>
            </div>
          </div>

          <div className="on-box on-box--toggle">
            <div>
              <strong>Avisarme cuando falten 2</strong>
              <span>Notificación en este dispositivo</span>
            </div>
            <IonToggle
              className="on-toggle"
              checked={avisar}
              onIonChange={(e) => setAvisar(e.detail.checked)}
            />
          </div>

          <div className="on-grow" />

          <IonButton className="on-btn on-btn--outline on-btn--block" onClick={() => history.push('/sala')}>
            Ver pantalla de sala
          </IonButton>
          <IonButton className="on-btn on-btn--danger on-btn--block" onClick={() => history.push('/turno/solicitar')}>
            Cancelar turno
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MiTurno;
