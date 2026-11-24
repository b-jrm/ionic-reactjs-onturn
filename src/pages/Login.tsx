// src/pages/Login.tsx
import { IonButton, IonContent, IonInput, IonPage, useIonRouter, IonCard, IonCardContent } from '@ionic/react';
import { useState } from 'react';

import { inputValue } from '../utils/ionValue';

type Rol = 'operador' | 'administrador';

const Login: React.FC = () => {
  const history = useIonRouter();
  const [rol, setRol] = useState<Rol>('operador');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  const ingresar = () => {
    // TODO: reemplazar por la autenticación real
    history.push(rol === 'administrador' ? '/admin/monitoreo' : '/operador');
  };

  return (
    <IonPage>
      <IonContent className="on-content" scrollY={false}>
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
                  className={rol === 'operador' ? 'is-active' : ''}
                  onClick={() => setRol('operador')}
                >
                  Operador
                </button>
                <button
                  className={rol === 'administrador' ? 'is-active' : ''}
                  onClick={() => setRol('administrador')}
                >
                  Administrador
                </button>
              </div>

              <div className="on-field">
                <label className="on-label">Usuario</label>
                <IonInput
                  className="on-input"
                  placeholder="correo o usuario"
                  value={usuario}
                  onIonInput={(e) => setUsuario(inputValue(e))}
                />
              </div>

              <div className="on-field">
                <label className="on-label">Contraseña</label>
                <IonInput
                  className="on-input"
                  type="password"
                  value={password}
                  onIonInput={(e) => setPassword(inputValue(e))}
                />
              </div>

              <IonButton className="on-btn on-btn--primary on-btn--block" onClick={ingresar}>
                Ingresar
              </IonButton>

              <IonCard className="on-field">
                  <IonCardContent>
                      <p>Capa de Seguridad/Autenticación no implementada, Para continuar&nbsp;&rarr;</p>
                      <IonButton color="primary" routerLink="manage/dashboard">Ir al dashboard administrativo</IonButton>
                  </IonCardContent>
              </IonCard>

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
