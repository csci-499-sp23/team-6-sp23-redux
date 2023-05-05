import { usePageTitle } from './usePageTitle';
import { useEffect } from 'react';

function PageTitle() {
  const pageTitle = usePageTitle();

  useEffect(() => {
    const baseTitle = 'Easy Hangout';
    document.title = `${baseTitle} | ${pageTitle}`;
  }, [pageTitle]);

  return null;
}

export default PageTitle;

