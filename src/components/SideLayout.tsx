// src/components/SideLayout.tsx
import { useIonRouter } from '@ionic/react';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';

export interface NavItem {
  label: string;
  to: string;
}

interface Props {
  items: NavItem[];
  activePath: string;
  user: { name: string; role: string };
  /** Tarjeta de usuario arriba del menú (estilo panel de operador) */
  userOnTop?: boolean;
  children: ReactNode;
}

const SideLayout: React.FC<Props> = ({ items, activePath, user, userOnTop, children }) => {

  const history = useIonRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      console.log("window.innerWidth <= 768", document.documentElement.clientWidth <= 768);
      setIsMobile(document.documentElement.clientWidth <= 768);
    };

    checkScreen();

    window.addEventListener('resize', checkScreen);

    return () => {
      window.removeEventListener('resize', checkScreen);
    };
  }, []);

  const userCard = (
    <div className="on-user">
      <strong>{user.name}</strong>
      <span>{user.role}</span>
    </div>
  );

  return (
    <div className="on-shell">
      <aside className={`on-side ${isMobile ? (menuOpen ? 'on-side--show' : 'on-side--hide') : ''}`}>

        { isMobile ? (
          <div className="on-side-top">
              <button
              className="on-side-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        ) : (
          <></>
        ) }
        

        <div className="on-side__brand">Onturn</div>
        {userOnTop && userCard}
        <nav className="on-side__nav" style={userOnTop ? { marginTop: 12 } : undefined}>
          {items.map((item) => (
            <button
              key={item.to}
              className={`on-nav ${activePath === item.to ? 'on-nav--active' : ''}`}
              onClick={() => history.push(item.to)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="on-side__spacer" />
        {!userOnTop && userCard}
        <button className="on-side__logout" onClick={() => history.push('/login')}>
          Cerrar sesión
        </button>
      </aside>
      <main>
        {children}
      </main>
    </div>
  );
};

export default SideLayout;
