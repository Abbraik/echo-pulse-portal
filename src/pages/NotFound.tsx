import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { logger } from '@/utils/logger';

const NotFound: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  React.useEffect(() => {
    logger.warn("404 Error: User attempted to access non-existent route", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <AlertTriangle className="h-24 w-24 text-amber-400 mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">
            {t('pageNotFound', { defaultValue: 'Page Not Found' })}
          </h2>
          <p className="text-gray-400 mb-8">
            {t('pageNotFoundMessage', { 
              defaultValue: 'The page you are looking for does not exist or has been moved.' 
            })}
          </p>
        </div>
        
        <Link to="/">
          <Button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600">
            <Home className="h-4 w-4 mr-2" />
            {t('backToHome', { defaultValue: 'Back to Home' })}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;