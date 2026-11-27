// src/components/SideLayout.tsx
import { useState } from 'react';

import { ENV, APP } from '../../config/environment';


const Debug: React.FC = () => {

  // console.log(ENV.name);
  // console.log(ENV.apiUrl);

  if (ENV.debug) console.log('App Debug Activate');
  
  const [debugOpen, setDebugOpen] = useState<boolean>(false);
  const [debugSection, setDebugSection] = useState<number>(0);

  // if (ENV.isProduction) {
  //   console.log('Aplicación en producción');
  // }

  return (
    <>
        { ENV.debug && (
            <>
            <span className='on-debug__btn-toggle-show' onClick={() => setDebugOpen(true)}>Dev&nbsp;☰</span>
            { debugOpen && (
                <div className='on-debug'>
                <div className='on-debug__row-toggle'>
                    <span className='on-debug__btn-toggle-hide' onClick={() => setDebugOpen(false)}>✕</span>
                </div>
                    <h3 onClick={() => setDebugSection((debugSection > 0 ? (debugSection !== 1 ? 1 : 0) : 1))}>Debug Data</h3>
                    {debugSection === 1 && (
                        <pre>
                        {JSON.stringify(APP, null, 2)}
                        </pre>
                    )}
                    <hr/>
                    <h3 onClick={() => setDebugSection((debugSection > 0 ? (debugSection !== 2 ? 2 : 0) : 2))}>Variables de entorno</h3>
                    {debugSection === 2 && (
                        <pre>
                        {JSON.stringify(import.meta.env, null, 2)}
                        </pre>
                    )}
                    <hr/>
                    <h3 onClick={() => setDebugSection((debugSection > 0 ? (debugSection !== 3 ? 3 : 0) : 3))}>Configuración ENV</h3>
                    {debugSection === 3 && (
                        <pre>
                        {JSON.stringify(ENV, null, 2)}
                        </pre>
                    )}
                    <hr />
                    <h3 onClick={() => setDebugSection((debugSection > 0 ? (debugSection !== 4 ? 4 : 0) : 4))}>Memoria</h3>
                    {debugSection === 4 && (
                        <pre>
                        {JSON.stringify(Object.keys(window).sort(), null, 2)}
                        </pre>
                    )}
                
                </div>
            )}
            </>
            
        ) }
    </>
  );
};

export default Debug;
