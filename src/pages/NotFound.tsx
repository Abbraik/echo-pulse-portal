
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import ParticlesBackground from '@/components/ui/particles-background';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative">
      <ParticlesBackground 
        count={40}
        colorStart="#14B8A6"
        colorEnd="#2563EB"
        minSize={2}
        maxSize={4}
        speed={0.3}
      />
      
      <div className="text-center relative z-10">
        <h1 className="text-4xl font-bold mb-4 text-white">404</h1>
        <p className="text-xl text-gray-300 mb-4">Oops! Page not found</p>
        <a href="/" className="text-teal-400 hover:text-teal-300 underline transition-colors">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
