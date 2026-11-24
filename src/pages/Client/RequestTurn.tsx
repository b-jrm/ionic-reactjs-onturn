// src/pages/cliente/SolicitarTurno.tsx
import { IonButton, IonContent, IonPage, useIonRouter, IonSelect, IonSelectOption } from '@ionic/react';
import { useState, useEffect } from 'react';

import { Model as ModelJornada } from '../../app/db/models/jornadas';
import { Model as ModelSucursal } from '../../app/db/models/sucursales';
import { Model as ModelTipo } from '../../app/db/models/tipos';
// import { inputValue } from '../../utils/ionValue';

// const TIPOS = [
//   { letra: 'G', nombre: 'Atención general', desc: 'Consultas y trámites básicos' },
//   { letra: 'C', nombre: 'Caja y pagos', desc: 'Pagos y recaudos' },
//   { letra: 'A', nombre: 'Asesoría comercial', desc: 'Productos y planes' },
//   { letra: 'R', nombre: 'Reclamos y PQRS', desc: 'Quejas y sugerencias' },
//   { letra: 'P', nombre: 'Atención prioritaria', desc: 'Adultos mayores y embarazadas' },
//   { letra: 'T', nombre: 'Cita agendada', desc: 'Ya reservaste cita' },
// ];

interface Jornada {
  id: number;
  nombre: string;
  tipos: number[];
}

const VACIAJORNADA: Jornada = { id: 0, nombre: '', tipos: [] };

interface DataForeign {
  id: number;
  nombre: string;
}

interface DataForeignTurn {
  id: number;
  nombre: string;
  prefijo: string;
  descripcion?: string;
}

interface TurnFormData {
  tipo_id: number;
  documento: string;
  nombres?: string;
  apellidos?: string;
  sucursal_id: number;
  jornada_id: number;
};

const VACIA: TurnFormData = {
  tipo_id: 0,
  documento: '',
  nombres: '',
  apellidos: '',
  sucursal_id: 0,
  jornada_id: 0,
};

const SolicitarTurno: React.FC = () => {


  const history = useIonRouter();

  const [tipos, setTipos] = useState<DataForeignTurn[]>([]);
  const [sucursales, setSucursales] = useState<DataForeign[]>([]);
  
  const [sucursal, setSucursal] = useState<DataForeign>({id: 0, nombre: ''});
  const [jornada, setJornada] = useState<Jornada | null>(VACIAJORNADA);

  const [form, setForm] = useState<TurnFormData>(VACIA);
  // const [error, setError] = useState('');

  // const [seleccion, setSeleccion] = useState(TIPOS[0]);
  // const [celular, setCelular] = useState('');

  const cargarData = async () => {
    try {
      setTipos( await ModelTipo.getAll("tipo_id AS id, nombre, prefijo, descripcion") );
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

  const cargarJornada = async (idSucursal: number) => {
    try {
      console.log("idSucursal",idSucursal);
      const data = await ModelJornada.getActiveUniqueBySucursal(idSucursal);
      console.log("data",data);
      setJornada(data);
      if(data?.id && data.tipos){
        setTipos( await ModelTipo.getTypeFilter(data.tipos) );
      }
    } catch (error) {
      console.error('Error al cargar jornada:', error);
      setJornada(VACIAJORNADA);
    }
  };

  useEffect(() => {
    const cargar = async () => await cargarJornada(sucursal.id);
    void cargar();
  }, [sucursal]);

  const ahora = new Date();
  const fecha = ahora.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
  const hora = ahora.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit', hour12: false });
  const fechaTxt = fecha.charAt(0).toUpperCase() + fecha.slice(1);

  const obtenerTurno = () => {
    // TODO: crear el turno en el backend y navegar con su id
    // Para pasar datos a la siguiente vista usa query params o un estado global:
    // history.push(`/turno/mi-turno?tipo=${seleccion.letra}&celular=${celular}`);
    history.push('/turn/me');
  };

  const setCampo = <K extends keyof TurnFormData>(campo: K, valor: TurnFormData[K]) => {
      setForm((f) => ({ ...f, [campo]: valor }));
  }

  return (
    <IonPage>
      <IonContent className="on-content" scrollY={false}>
        <div className="on-kiosk">
          <header className="on-topbar">
            <strong>Onturn</strong>

            <div className="on-field">
              <span>{fechaTxt} · {hora} · {jornada?.nombre}</span>
              <label className="on-label">Sucursal</label>
              <IonSelect
                  placeholder="Seleccionar Sucursal"
                  interface="alert" 
                  value={form.sucursal_id} 
                  onIonChange={(e) => {
                      const currentSucursal = sucursales.find(s => s.id === Number(e.detail.value));
                      setSucursal({id: Number(e.detail.value), nombre: currentSucursal?.nombre ?? ''});
                      setCampo('sucursal_id', Number(e.detail.value));
                    }
                  }
              >
                  {sucursales.map((s) => (
                    <IonSelectOption key={s.id} value={s.id}>{s.nombre}</IonSelectOption>
                  ))}
              </IonSelect>
            </div>

          </header>

          <section className="on-kiosk__body">
            <h1>¿Qué tipo de atención necesitas?</h1>
            <p className="on-sub" style={{ fontSize: 17 }}>
              Elige una opción para recibir tu turno. No necesitas registrarte.
            </p>

            <div className="on-tipos">
              {tipos.map((t) => (
                <button
                  key={t.id}
                  className={`on-tipo ${form.tipo_id === t.id ? 'is-selected' : ''}`}
                  onClick={() => setCampo('tipo_id', t.id)}
                >
                  <div className="on-tipo__letter">{t.prefijo}</div>
                  <div>
                    <strong>{t.nombre}</strong>
                    <span>{t.descripcion}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <footer className="on-footbar">
            <div className="on-footbar__sel">
              Seleccionaste: <b>{tipos.find(t => t.id === form.tipo_id)?.nombre}</b>
            </div>
            <div className="on-footbar__right">
              {/* <div>
                <label className="on-label">Celular (opcional)</label>
                <IonInput
                  className="on-input"
                  type="tel"
                  inputmode="tel"
                  placeholder="300 000 0000"
                  value={celular}
                  onIonInput={(e) => setCelular(inputValue(e))}
                />
              </div> */}
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
