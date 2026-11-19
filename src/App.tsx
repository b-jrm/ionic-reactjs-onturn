// src/App.tsx
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Navigate, Route } from 'react-router-dom';

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

import Branches from './pages/Admin/Branches';
import Positions from './pages/Admin/Positions';
import Dashboard from './pages/Admin/Dashboard';
import Monitoring from './pages/Admin/Monitoring';
import Workdays from './pages/Admin/Workdays';
import MyTurn from './pages/Client/MyTurn';
import RequestTurn from './pages/Client/RequestTurn';
import Login from './pages/Login';
import ServicePanel from './pages/Operator/ServicePanel';
import RoomScreen from './pages/RoomScreen';

setupIonicReact({ mode: 'md' });

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/login" element={<Login/>} />
        {/* Administrador */}
        <Route path="/manage" element={<Navigate to="/login" replace />} />
        <Route path="/manage/dashboard" element={<Dashboard/>} />
        <Route path="/manage/monitoring" element={<Monitoring/>} />
        <Route path="/manage/workdays" element={<Workdays/>} />
        <Route path="/manage/branches" element={<Branches/>} />

        {/* Operador */}
        <Route path="/operador" element={<ServicePanel/>} />

        {/* Cliente (sin cuenta) */}
        <Route path="/request" element={<RequestTurn/>} />
        <Route path="/me" element={<MyTurn/>} />

        {/* Pantalla pública */}
        <Route path="/room" element={<RoomScreen/>} />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
