// src/pages/admin/Sucursales.tsx
// CRUD de sucursales (Ionic 7.2.1 + React Router v5)
import { IonContent, IonPage } from '@ionic/react';

import SideLayout from '../../components/SideLayout';
// import { testSQLite } from '../SQLiteTest';

import { adminNav } from './nav';

const Positions: React.FC = () => {

  return (
    <IonPage>
      <IonContent className="on-content">
        <SideLayout
          items={adminNav}
          activePath="/manage/reports"
          user={{ name: 'admin@onturn.co', role: 'Administrador' }}
        >
          <div className="on-main">
            <div className="on-main__head">
              <div>
                <h1 className="on-h1">Reportes</h1>
                <p className="on-sub">Consulta y exporta consolidados</p>
              </div>
            </div>

          </div>
        </SideLayout>
      </IonContent>
    </IonPage>
  );
};

export default Positions;