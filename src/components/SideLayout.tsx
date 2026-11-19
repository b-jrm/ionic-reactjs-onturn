// src/components/SideLayout.tsx
import { useIonRouter } from '@ionic/react';
import type { ReactNode } from 'react';

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

  const userCard = (
    <div className="on-user">
      <strong>{user.name}</strong>
      <span>{user.role}</span>
    </div>
  );

  return (
    <div className="on-shell">
      <aside className="on-side">
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
      <main>{children}</main>
    </div>
  );
};

export default SideLayout;
