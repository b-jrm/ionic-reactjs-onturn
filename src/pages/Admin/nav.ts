// src/pages/admin/nav.ts
import type { NavItem } from '../../components/SideLayout';

export const adminNav: NavItem[] = [
  { label: 'Panel', to: '/manage/dashboard' },
  { label: 'Sucursales', to: '/manage/branches' },
  { label: 'Jornadas', to: '/manage/workdays' },
  { label: 'Puestos', to: '/manage/positions' },
  { label: 'Tipos de atención', to: '/manage/services' },
  { label: 'Turnos', to: '/manage/turns' },
  { label: 'Monitoreo', to: '/manage/monitoring' },
  { label: 'Reportes', to: '/manage/reports' },
  { label: 'Usuarios', to: '/manage/users' },
  { label: 'Configuración', to: '/manage/setting' },
];
