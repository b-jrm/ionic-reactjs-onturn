// src/pages/cliente/SolicitarTurno.tsx
import { IonButton, IonContent, IonInput, IonPage, useIonRouter } from '@ionic/react';
import { useState } from 'react';

import { inputValue } from '../../utils/ionValue';

const TIPOS = [
  { letra: 'G', nombre: 'Atención general', desc: 'Consultas y trámites básicos' },
  { letra: 'C', nombre: 'Caja y pagos', desc: 'Pagos y recaudos' },
  { letra: 'A', nombre: 'Asesoría comercial', desc: 'Productos y planes' },
  { letra: 'R', nombre: 'Reclamos y PQRS', desc: 'Quejas y sugerencias' },
  { letra: 'P', nombre: 'Atención prioritaria', desc: 'Adultos mayores y embarazadas' },
  { letra: 'T', nombre: 'Cita agendada', desc: 'Ya reservaste cita' },
];

const SolicitarTurno: React.FC = () => {
  const history = useIonRouter();
  const [seleccion, setSeleccion] = useState(TIPOS[0]);
  const [celular, setCelular] = useState('');

  const ahora = new Date();
  const fecha = ahora.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
  const hora = ahora.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit', hour12: false });
  const fechaTxt = fecha.charAt(0).toUpperCase() + fecha.slice(1);

  const obtenerTurno = () => {
    // TODO: crear el turno en el backend y navegar con su id
    // Para pasar datos a la siguiente vista usa query params o un estado global:
    // history.push(`/turno/mi-turno?tipo=${seleccion.letra}&celular=${celular}`);
    history.push('/turno/mi-turno');
  };

  return (
    <IonPage>
      <IonContent className="on-content" scrollY={false}>
        <div className="on-kiosk">
          <header className="on-topbar">
            <strong>Onturn</strong>
            <span>{fechaTxt} · {hora} · Jornada de la mañana</span>
          </header>

          <section className="on-kiosk__body">
            <h1>¿Qué tipo de atención necesitas?</h1>
            <p className="on-sub" style={{ fontSize: 17 }}>
              Elige una opción para recibir tu turno. No necesitas registrarte.
            </p>

            <div className="on-tipos">
              {TIPOS.map((t) => (
                <button
                  key={t.letra}
                  className={`on-tipo ${seleccion.letra === t.letra ? 'is-selected' : ''}`}
                  onClick={() => setSeleccion(t)}
                >
                  <div className="on-tipo__letter">{t.letra}</div>
                  <div>
                    <strong>{t.nombre}</strong>
                    <span>{t.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <footer className="on-footbar">
            <div className="on-footbar__sel">
              Seleccionaste: <b>{seleccion.nombre}</b>
            </div>
            <div className="on-footbar__right">
              <div>
                <label className="on-label">Celular (opcional)</label>
                <IonInput
                  className="on-input"
                  type="tel"
                  inputmode="tel"
                  placeholder="300 000 0000"
                  value={celular}
                  onIonInput={(e) => setCelular(inputValue(e))}
                />
              </div>
              <IonButton className="on-btn on-btn--primary on-btn--lg" onClick={obtenerTurno}>
                Obtener turno
              </IonButton>
            </div>
          </footer>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SolicitarTurno;
