import { Capacitor } from '@capacitor/core';
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

// import { ENV } from '../config/environment';

// Estilos Ionic
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

// Estilos personalizados
import './theme/variables.scss';

// --- SQLite Web ---
if (Capacitor.getPlatform() === 'web') {

  jeepSqlite(window);

  const initJeepSqlite = () => {
    if (!document.querySelector('jeep-sqlite')) {
      const el = document.createElement('jeep-sqlite');
      document.body.appendChild(el);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      initJeepSqlite,
      { once: true }
    );
  } else {
    initJeepSqlite();
  }
}

// --- Inicialización React ---
ReactDOM.createRoot(
  document.getElementById('root')!
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
