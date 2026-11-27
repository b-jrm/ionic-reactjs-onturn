// src/pages/Login.tsx
import { IonButton, IonContent, IonInput, IonPage, useIonRouter } from '@ionic/react';
import { useState, useEffect } from 'react';

import { APP, ENV } from '../../config/environment';
import { Model as ModelUsuario } from '../app/db/models/usuarios';
import { inputValue } from '../utils/ionValue';

type Rol = 'Operador' | 'Administrador';

const Login: React.FC = () => {
  const history = useIonRouter();
  const [rol, setRol] = useState<Rol>('Operador');
  const [usuario, setUsuario] = useState((ENV.debug ? 'operator1@onturn.co' : ''));
  const [password, setPassword] = useState((ENV.debug ? 'operator1' : ''));
  const [error, setError] = useState('');

  useEffect(() => {
    APP.setDebugData({
        rol,
        usuario,
        password,
        error
      });
  }, [rol, usuario, password, error]);
  
  const ingresar = () => {
    setError('');
    // TODO: reemplazar por la autenticación real
    ModelUsuario.getAuth(usuario, password, rol).then(isAuth => {
        // console.log("Autenticado:", isAuth);
        if(isAuth) history.push(rol === 'Administrador' ? '/manage/users' : '/operador');
        else{
          setError('Credenciales incorrectas');
          return;
        }
    });

  };

  return (
    <IonPage>
      <IonContent className="on-content" scrollY={true}>
        <div className="on-login">
          {/* Panel de marca */}
          <section className="on-login__brand">
            <div className="on-logo">
              <div className="on-logo__box">logo</div>
              Onturn
            </div>

            <div>
              <h1 className="on-login__headline">
                Gestión de turnos y monitoreo de atención al cliente
              </h1>
              <div className="on-skeleton" style={{ width: '100%', maxWidth: 420 }} />
              <div className="on-skeleton" style={{ width: '65%', maxWidth: 280 }} />
            </div>

            <div className="on-login__foot">Web · Escritorio · Móvil</div>
          </section>

          {/* Formulario */}
          <section className="on-login__form">
            <div>
              <h1 className="on-h1" style={{ fontSize: 36 }}>Iniciar sesión</h1>
              <p className="on-sub">Solo administradores y operadores.</p>

              <div className="on-segment">
                <button
                  className={rol === 'Operador' ? 'is-active' : ''}
                  onClick={() => { setRol('Operador'); setError(''); if(ENV.debug){ setUsuario('operator1@onturn.co'); setPassword('operator1'); } }}
                >
                  Operador
                </button>
                <button
                  className={rol === 'Administrador' ? 'is-active' : ''}
                  onClick={() => { setRol('Administrador'); setError(''); if(ENV.debug){ setUsuario('admin@onturn.co'); setPassword('admin'); } }}
                >
                  Administrador
                </button>
              </div>

              <div className="on-field">
                <label className="on-label">Correo electrónico</label>
                <IonInput
                  className="on-input"
                  placeholder="Correo electrónico"
                  value={usuario}
                  onIonInput={(e) => { setUsuario(inputValue(e)); setError(''); }}
                />
              </div>

              <div className="on-field">
                <label className="on-label">Contraseña</label>
                <IonInput
                  className="on-input"
                  type="password" 
                  placeholder="Contraseña"
                  value={password}
                  onIonInput={(e) => { setPassword(inputValue(e)); setError(''); }}
                />
              </div>

              {error && <p className="on-error">{error}</p>}

              <IonButton className="on-btn on-btn--primary on-btn--block" onClick={ingresar}>
                Ingresar
              </IonButton>

              <hr className="on-divider" />
              <p className="on-muted" style={{ margin: 0 }}>
                ¿Eres cliente? No necesitas cuenta.{' '}
                <button type="button" className="on-link" onClick={() => history.push('/turn/request')}>
                  Solicitar un turno
                </button>
              </p>
            </div>
          </section>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
