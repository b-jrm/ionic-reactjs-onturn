import { IonContent, IonPage, IonButton, IonGrid, IonRow, IonCol } from '@ionic/react';

// import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle>OnTurn</IonTitle>
        </IonToolbar>
      </IonHeader> */}
      <IonContent fullscreen color="light">
        <IonGrid >
          <IonRow>
            <IonCol>Col</IonCol>
          </IonRow>
        </IonGrid>
        <IonButton routerLink="/dashboard">Dashboard</IonButton>
        <IonButton routerLink="/operator">Operator</IonButton>
        <IonButton routerLink="/turns">Turns</IonButton>
        <IonButton routerLink="/screen">Screen</IonButton>
        {/* <ExploreContainer /> */}
      </IonContent>
    </IonPage>
  );
};

export default Home;
