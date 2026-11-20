
import { IonPage, IonContent } from '@ionic/react'; 

import SideLayout from '../../components/SideLayout';

import { adminNav } from './nav';

import './Dashboard.css';

const Dashboard: React.FC = () => {

    return (
        <>

            <IonPage>

                <IonContent className="on-content">

                    <SideLayout
                        items={adminNav}
                        activePath="/manage/dashboard"
                        user={{ name: 'Carlos Ruiz', role: 'Administrador' }}
                    >
                        <div className="on-main">
                            <div className="on-main__head">
                                <div>
                                    <h1 className="on-h1">¡Puestos!</h1>
                                    <p className="on-sub">Crea, Actualiza o Inactiva Puestos.</p>
                                </div>
                            </div>
                        </div>
                    </SideLayout>

                </IonContent>

            </IonPage>
        </>
    );
};

export default Dashboard;
