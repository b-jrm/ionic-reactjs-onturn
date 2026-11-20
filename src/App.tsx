// src/App.tsx
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';

/* CSS core de Ionic */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Tema Onturn (siempre después de los CSS de Ionic) */
import './theme/onturn.css';

import { SqliteService } from './app/db/sqlite.service';
import Branches from './pages/Admin/Branches';
import Dashboard from './pages/Admin/Dashboard';
import Monitoring from './pages/Admin/Monitoring';
import Positions from './pages/Admin/Positions';
import Workdays from './pages/Admin/Workdays';
import MyTurn from './pages/Client/MyTurn';
import RequestTurn from './pages/Client/RequestTurn';
import Login from './pages/Login';
import ServicePanel from './pages/Operator/ServicePanel';
import RoomScreen from './pages/RoomScreen';

setupIonicReact({ mode: 'md' });

const App: React.FC = () => {

  useEffect(() => {
    const initializeSQLite = async () => {
      try {
        const sqlite = new SqliteService();
        await sqlite.init();
        console.log('SQLite inicializado correctamente');
      } catch (e) {
        console.error('Error iniciando SQLite', e);
      }
    };

    initializeSQLite();
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/login" component={Login} />
          {/* Administrador */}
          <Route exact path="/manage"><Redirect to="/login" /></Route>
          <Route path="/manage/dashboard" component={Dashboard} />
          <Route path="/manage/monitoring" component={Monitoring} />
          <Route path="/manage/positions" component={Positions} />
          <Route path="/manage/workdays" component={Workdays} />
          <Route path="/manage/branches" component={Branches} />

          {/* Operador */}
          <Route path="/operador" component={ServicePanel} />

          {/* Cliente (sin cuenta) */}
          <Route path="/request" component={RequestTurn} />
          <Route path="/me" component={MyTurn} />

          {/* Pantalla pública */}
          <Route path="/room" component={RoomScreen} />

          <Route exact path="/"><Redirect to="/login" /></Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
