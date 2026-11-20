
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { useEffect } from 'react';

import { SqliteService } from './db/sqlite.service';

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
      <IonRouterOutlet/>
    </IonApp>
  );
};

export default App;
