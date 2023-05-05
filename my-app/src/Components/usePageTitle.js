import { useLocation } from 'react-router-dom';

export function usePageTitle() {
  const location = useLocation();
  const pageTitle = location.pathname.split('/').slice(-1)[0];
  return pageTitle;
}

