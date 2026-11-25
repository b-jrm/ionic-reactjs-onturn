// src/pages/admin/nav.ts
import type { NavItem } from '../../components/SideLayout';

export const adminNav: NavItem[] = [
  // { label: 'Panel', to: '/manage/dashboard' },
  { label: 'Usuarios', to: '/manage/users' },
  { label: 'Sucursales', to: '/manage/branches' },
  { label: 'Puestos', to: '/manage/positions' },
  { label: 'Servicios', to: '/manage/services' },
  { label: 'Jornadas', to: '/manage/workdays' },
  // { label: 'Monitoreo', to: '/manage/monitoring' },
  // { label: 'Reportes', to: '/manage/reports' },
  
  // { label: 'Turnos', to: '/manage/turns' },
  // { label: 'Configuración', to: '/manage/setting' },
];
