// src/pages/SalaDisplay.tsx
// Pantalla pública de sala (TV / monitor)
import { IonContent, IonPage } from '@ionic/react';
import { useEffect, useState } from 'react';


const ULTIMOS = [
  { turno: 'C-018', puesto: 'Puesto 1' },
  { turno: 'A-009', puesto: 'Puesto 4' },
  { turno: 'G-042', puesto: 'Puesto 2' },
  { turno: 'P-004', puesto: 'Puesto 5' },
];

const COLAS = [
  { letra: 'G', espera: 6 },
  { letra: 'C', espera: 3 },
  { letra: 'A', espera: 4 },
  { letra: 'R', espera: 2 },
  { letra: 'P', espera: 1 },
];

const SalaDisplay: React.FC = () => {
  const [hora, setHora] = useState(new Date());
  // TODO: alimentar con websocket; al cambiar `llamando` se activa la animación
  const llamando = { turno: 'G-043', puesto: 'Puesto 3', tipo: 'Atención general' };

  useEffect(() => {
    const id = setInterval(() => setHora(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const horaTxt = hora.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit', hour12: false });

  return (
    <IonPage>
      <IonContent className="on-content-dark">
        <div className="on-tv">
          <header className="on-tv__head">
            <strong>Onturn</strong>
            <span className="on-tv__clock">{horaTxt}</span>
          </header>

          <section className="on-tv__main">
            <div className="on-tv__now is-calling">
              <small>LLAMANDO AHORA</small>
              <div className="on-tv__num">{llamando.turno}</div>
              <div className="on-tv__now-foot">
                <div>
                  <span>Pasa al</span>
                  <strong>{llamando.puesto}</strong>
                </div>
                <em>{llamando.tipo}</em>
              </div>
            </div>

            <div className="on-tv__last">
              <h3>ÚLTIMOS LLAMADOS</h3>
              <div className="on-tv__list">
                {ULTIMOS.map((u) => (
                  <div className="on-tv__item" key={u.turno}>
                    <b>{u.turno}</b>
                    <span>{u.puesto}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <footer className="on-tv__queues">
            {COLAS.map((c) => (
              <div className="on-tv__q" key={c.letra}>
                <b>{c.letra}</b> · {c.espera} en espera
              </div>
            ))}
          </footer>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SalaDisplay;
