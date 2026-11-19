
import { IonPage, IonContent, IonButton, IonIcon, IonBadge, IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonNote } from '@ionic/react'; 
import {
    ticketOutline,
    timeOutline,
    checkmarkCircleOutline,
    hourglassOutline
} from 'ionicons/icons';

import SideLayout from '../../components/SideLayout';

import { adminNav } from './nav';

import './Dashboard.css';

const Dashboard: React.FC = () => {

    const turnos = [
        { numero: 'A-025', cliente: 'Carlos Rodríguez', servicio: 'Información', estado: 'Atendido', hora: '09:15' },
        { numero: 'A-026', cliente: 'María López', servicio: 'Facturación', estado: 'En atención', hora: '09:20' },
        { numero: 'A-027', cliente: 'Andrés Pérez', servicio: 'Soporte', estado: 'En espera', hora: '09:25' },
        { numero: 'A-028', cliente: 'Laura Gómez', servicio: 'Información', estado: 'En espera', hora: '09:30' },
        { numero: 'A-029', cliente: 'Pedro Martínez', servicio: 'Facturación', estado: 'En espera', hora: '09:35' }
    ];

    return (
        <>
            {/* MENÚ LATERAL */}
            {/* <IonMenu contentId="main-content" className="sidebar">
                <IonContent>
                    <div className="sidebar-brand">
                        <h2>OnTurn</h2>
                        <span>Gestión de turnos</span>
                    </div>

                    <IonList lines="none">
                        <IonItem button routerLink="/dashboard">
                            <IonIcon icon={homeOutline} slot="start" />
                            <IonLabel>Dashboard</IonLabel>
                        </IonItem>

                        <IonItem button routerLink="/manage/branches">
                            <IonIcon icon={ticketOutline} slot="start" />
                            <IonLabel>Sedes/Puestos</IonLabel>
                        </IonItem>

                        <IonItem button routerLink="/manage/turns">
                            <IonIcon icon={ticketOutline} slot="start" />
                            <IonLabel>Turnos</IonLabel>
                        </IonItem>

                        <IonItem button routerLink="/manage/clients">
                            <IonIcon icon={peopleOutline} slot="start" />
                            <IonLabel>Clientes</IonLabel>
                        </IonItem>

                        <IonItem button routerLink="/manage/reports">
                            <IonIcon icon={statsChartOutline} slot="start" />
                            <IonLabel>Reportes</IonLabel>
                        </IonItem>

                        <IonItem button routerLink="/manage/setting">
                            <IonIcon icon={settingsOutline} slot="start" />
                            <IonLabel>Configuración</IonLabel>
                        </IonItem>
                    </IonList>
                </IonContent>
            </IonMenu> */}

            {/* CONTENIDO PRINCIPAL */}
            <IonPage>

                {/* <IonHeader className="dashboard-header">
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonMenuButton />
                        </IonButtons>

                        <IonTitle>Dashboard</IonTitle>

                        <IonButtons slot="end">
                            <IonButton>
                                <IonIcon icon={notificationsOutline} />
                                <IonBadge color="danger">3</IonBadge>
                            </IonButton>

                            <IonButton>
                                <IonIcon icon={personCircleOutline} />
                                <span className="user-name">Administrador</span>
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader> */}

                <IonContent className="on-content">

                    <SideLayout
                        items={adminNav}
                        activePath="/manage/dashboard"
                        user={{ name: 'Carlos Ruiz', role: 'Administrador' }}
                    >
                        <div className="on-main">
                            <div className="on-main__head">
                                <div>
                                    <h1 className="on-h1">¡Bienvenido!</h1>
                                    <p className="on-sub">Panel general de atención.</p>
                                </div>
                                <IonBadge color="success">
                                    Jornada activa
                                </IonBadge>
                            </div>

                            {/* INDICADORES */}
                            <IonGrid className="stats-grid">
                                <IonRow>

                                    <IonCol size="12" sizeMd="6" sizeLg="3">
                                        <IonCard className="stat-card">
                                            <IonCardContent>
                                                <div className="stat-icon blue">
                                                    <IonIcon icon={ticketOutline} />
                                                </div>
                                                <p>Total de turnos</p>
                                                <h2>128</h2>
                                                <IonNote>Turnos generados hoy</IonNote>
                                            </IonCardContent>
                                        </IonCard>
                                    </IonCol>

                                    <IonCol size="12" sizeMd="6" sizeLg="3">
                                        <IonCard className="stat-card">
                                            <IonCardContent>
                                                <div className="stat-icon green">
                                                    <IonIcon icon={checkmarkCircleOutline} />
                                                </div>
                                                <p>Atendidos</p>
                                                <h2>86</h2>
                                                <IonNote>67% del total</IonNote>
                                            </IonCardContent>
                                        </IonCard>
                                    </IonCol>

                                    <IonCol size="12" sizeMd="6" sizeLg="3">
                                        <IonCard className="stat-card">
                                            <IonCardContent>
                                                <div className="stat-icon orange">
                                                    <IonIcon icon={hourglassOutline} />
                                                </div>
                                                <p>En espera</p>
                                                <h2>32</h2>
                                                <IonNote>Esperando atención</IonNote>
                                            </IonCardContent>
                                        </IonCard>
                                    </IonCol>

                                    <IonCol size="12" sizeMd="6" sizeLg="3">
                                        <IonCard className="stat-card">
                                            <IonCardContent>
                                                <div className="stat-icon purple">
                                                    <IonIcon icon={timeOutline} />
                                                </div>
                                                <p>Tiempo promedio</p>
                                                <h2>08:35</h2>
                                                <IonNote>Tiempo de atención</IonNote>
                                            </IonCardContent>
                                        </IonCard>
                                    </IonCol>

                                </IonRow>
                            </IonGrid>

                            {/* TABLA DE TURNOS */}
                            <IonCard className="turns-card">
                                <IonCardContent>

                                    <div className="section-heading">
                                        <div>
                                            <h2>Últimos turnos</h2>
                                            <p>Estado actual de los turnos generados.</p>
                                        </div>

                                        <IonButton fill="outline" size="small">
                                            Ver todos
                                        </IonButton>
                                    </div>

                                    <div className="table-wrapper">
                                        <table className="turns-table">
                                            <thead>
                                                <tr>
                                                    <th>Turno</th>
                                                    <th>Cliente</th>
                                                    <th>Servicio</th>
                                                    <th>Hora</th>
                                                    <th>Estado</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {turnos.map((turno) => (
                                                    <tr key={turno.numero}>
                                                        <td><strong>{turno.numero}</strong></td>
                                                        <td>{turno.cliente}</td>
                                                        <td>{turno.servicio}</td>
                                                        <td>{turno.hora}</td>
                                                        <td>
                                                            <span className={`status ${turno.estado.toLowerCase().replace(' ', '-')}`}>
                                                                {turno.estado}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                </IonCardContent>
                            </IonCard>

                        </div>
                    </SideLayout>

                </IonContent>

            </IonPage>
        </>
    );
};

export default Dashboard;
