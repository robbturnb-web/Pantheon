import { useLocation } from 'react-router-dom';

export function useSection(): string {
  const { pathname } = useLocation();
  if (pathname === '/') return 'home';
  return pathname.replace('/', '');
}
